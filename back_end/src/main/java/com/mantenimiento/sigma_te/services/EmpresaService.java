package com.mantenimiento.sigma_te.services;

import com.mantenimiento.sigma_te.dto.empresa.EmpresaRegistroDTO;
import com.mantenimiento.sigma_te.dto.empresa.EmpresaResponseDTO;
import com.mantenimiento.sigma_te.models.Empresa;
import com.mantenimiento.sigma_te.models.EmpresaPermiso;
import com.mantenimiento.sigma_te.models.EmpresaPermisoId;
import com.mantenimiento.sigma_te.models.Permiso;
import com.mantenimiento.sigma_te.models.Rol;
import com.mantenimiento.sigma_te.models.RolPermiso;
import com.mantenimiento.sigma_te.models.RolPermisoId;
import com.mantenimiento.sigma_te.models.Usuario;
import com.mantenimiento.sigma_te.repositories.EmpresaPermisoRepository;
import com.mantenimiento.sigma_te.repositories.EmpresaRepository;
import com.mantenimiento.sigma_te.repositories.PermisoRepository;
import com.mantenimiento.sigma_te.repositories.RolPermisoRepository;
import com.mantenimiento.sigma_te.repositories.RolRepository;
import com.mantenimiento.sigma_te.repositories.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final EmpresaPermisoRepository empresaPermisoRepository;
    private final RolRepository rolRepository;
    private final RolPermisoRepository rolPermisoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PermisoRepository permisoRepository;
    private final PasswordEncoder passwordEncoder;

    public EmpresaService(EmpresaRepository empresaRepository,
                          EmpresaPermisoRepository empresaPermisoRepository,
                          RolRepository rolRepository,
                          RolPermisoRepository rolPermisoRepository,
                          UsuarioRepository usuarioRepository,
                          PermisoRepository permisoRepository,
                          PasswordEncoder passwordEncoder) {
        this.empresaRepository = empresaRepository;
        this.empresaPermisoRepository = empresaPermisoRepository;
        this.rolRepository = rolRepository;
        this.rolPermisoRepository = rolPermisoRepository;
        this.usuarioRepository = usuarioRepository;
        this.permisoRepository = permisoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public EmpresaResponseDTO registrarEmpresaConAdmin(EmpresaRegistroDTO request) {
        // Validaciones previas
        if (request.nombreEmpresa() == null || request.nombreEmpresa().trim().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre de la empresa es obligatorio.");
        }
        if (request.nombreUsuario() == null || request.nombreUsuario().trim().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre del usuario administrador es obligatorio.");
        }
        if (request.correoUsuario() == null || request.correoUsuario().trim().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El correo del usuario administrador es obligatorio.");
        }
        if (request.contrasenaHash() == null || request.contrasenaHash().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña inicial es obligatoria.");
        }

        String nombreEmpresaLimpio = request.nombreEmpresa().trim();
        String correoUsuarioLimpio = request.correoUsuario().trim();

        if (empresaRepository.existsByNombreEmpresa(nombreEmpresaLimpio)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una empresa registrada con ese nombre.");
        }
        if (usuarioRepository.existsByCorreoUsuario(correoUsuarioLimpio)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este correo ya está registrado por otro usuario.");
        }

        List<Permiso> permisosHabilitados = resolverPermisos(request);
        if (permisosHabilitados.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debe habilitar al menos un permiso para la empresa.");
        }

        // a. Crea la fila en empresa
        Empresa empresa = Empresa.builder()
                .nombreEmpresa(nombreEmpresaLimpio)
                .estadoEmpresa(true)
                .fechaCreacion(LocalDateTime.now())
                .build();
        Empresa empresaGuardada = empresaRepository.save(empresa);

        // b. Inserta en empresa_permiso todos los permisos habilitados recibidos
        for (Permiso permiso : permisosHabilitados) {
            EmpresaPermisoId empresaPermisoId = new EmpresaPermisoId(empresaGuardada.getIdEmpresa(), permiso.getIdPermiso());
            EmpresaPermiso empresaPermiso = EmpresaPermiso.builder()
                    .id(empresaPermisoId)
                    .fechaAsignacion(LocalDateTime.now())
                    .build();
            empresaPermisoRepository.save(empresaPermiso);
        }

        // c. Crea un Rol nuevo para esa empresa: nombreRol "Administrador de Empresa", esProtegido = true, empresa = la empresa recién creada
        Rol rolAdminEmpresa = Rol.builder()
                .empresa(empresaGuardada)
                .nombreRol("Administrador de Empresa")
                .descripcionRol("Rol administrativo principal de " + empresaGuardada.getNombreEmpresa())
                .estadoRol(true)
                .esProtegido(true)
                .build();
        Rol rolGuardado = rolRepository.save(rolAdminEmpresa);

        // d. Asigna a ese rol TODOS los permisos que se le habilitaron a la empresa (vía rol_permiso)
        for (Permiso permiso : permisosHabilitados) {
            RolPermisoId rolPermisoId = new RolPermisoId(rolGuardado.getIdRol(), permiso.getIdPermiso());
            RolPermiso rolPermiso = RolPermiso.builder()
                    .id(rolPermisoId)
                    .fechaAsignacion(LocalDateTime.now())
                    .build();
            rolPermisoRepository.save(rolPermiso);
        }

        // e. Crea el usuario con ese rol y esa empresa, contraseña encriptada con PasswordEncoder, y requiereCambioPassword = true
        Usuario subAdmin = Usuario.builder()
                .empresa(empresaGuardada)
                .nombreUsuario(request.nombreUsuario().trim())
                .correoUsuario(correoUsuarioLimpio)
                .rol(rolGuardado)
                .contrasenaHash(passwordEncoder.encode(request.contrasenaHash()))
                .cuentaActiva(true)
                .fechaCreacion(LocalDateTime.now())
                .requiereCambioPassword(true)
                .intentosFallidos(0)
                .build();
        Usuario usuarioGuardado = usuarioRepository.save(subAdmin);

        List<String> nombresPermisos = permisosHabilitados.stream()
                .map(Permiso::getNombrePermiso)
                .toList();

        return new EmpresaResponseDTO(
                empresaGuardada.getIdEmpresa(),
                empresaGuardada.getNombreEmpresa(),
                empresaGuardada.getEstadoEmpresa(),
                empresaGuardada.getFechaCreacion(),
                usuarioGuardado.getIdUsuario(),
                usuarioGuardado.getNombreUsuario(),
                usuarioGuardado.getCorreoUsuario(),
                rolGuardado.getIdRol(),
                rolGuardado.getNombreRol(),
                nombresPermisos
        );
    }

    private List<Permiso> resolverPermisos(EmpresaRegistroDTO request) {
        Set<Integer> ids = new LinkedHashSet<>();
        Set<String> nombres = new LinkedHashSet<>();

        if (request.permisosIds() != null) {
            ids.addAll(request.permisosIds());
        }
        if (request.permisosNombres() != null) {
            nombres.addAll(request.permisosNombres());
        }
        if (request.permisos() != null) {
            for (Object p : request.permisos()) {
                if (p instanceof Number num) {
                    ids.add(num.intValue());
                } else if (p instanceof String str) {
                    str = str.trim();
                    if (str.matches("\\d+")) {
                        ids.add(Integer.parseInt(str));
                    } else {
                        nombres.add(str);
                    }
                }
            }
        }

        Set<Permiso> resultado = new LinkedHashSet<>();
        for (Integer id : ids) {
            Permiso permiso = permisoRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Permiso no encontrado con ID: " + id));
            resultado.add(permiso);
        }
        for (String nombre : nombres) {
            Permiso permiso = permisoRepository.findByNombrePermiso(nombre)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Permiso no encontrado con nombre: " + nombre));
            resultado.add(permiso);
        }

        return new ArrayList<>(resultado);
    }
}
