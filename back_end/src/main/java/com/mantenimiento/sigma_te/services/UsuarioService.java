package com.mantenimiento.sigma_te.services;

import com.mantenimiento.sigma_te.dto.usuario.UsuarioCambiarEstadoDTO;
import com.mantenimiento.sigma_te.dto.usuario.UsuarioDTO;
import com.mantenimiento.sigma_te.dto.usuario.UsuarioRequestDTO;
import com.mantenimiento.sigma_te.models.Empresa;
import com.mantenimiento.sigma_te.models.Rol;
import com.mantenimiento.sigma_te.models.Usuario;
import com.mantenimiento.sigma_te.repositories.EmpresaRepository;
import com.mantenimiento.sigma_te.repositories.RolRepository;
import com.mantenimiento.sigma_te.repositories.UsuarioRepository;
import com.mantenimiento.sigma_te.security.TenantContext;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmpresaRepository empresaRepository;
    private final TenantContext tenantContext;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          RolRepository rolRepository,
                          PasswordEncoder passwordEncoder,
                          EmpresaRepository empresaRepository,
                          TenantContext tenantContext) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
        this.empresaRepository = empresaRepository;
        this.tenantContext = tenantContext;
    }

    public List<UsuarioDTO> listarTodos(Authentication authentication) {
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        List<Usuario> usuarios = idEmpresaActual == null
                ? usuarioRepository.findByEmpresaIsNull()
                : usuarioRepository.findByEmpresa_IdEmpresa(idEmpresaActual);

        String correoActual = authentication != null ? authentication.getName() : null;
        return usuarios.stream()
                .filter(u -> correoActual == null || !correoActual.equals(u.getCorreoUsuario()))
                .map(this::convertirADto)
                .toList();
    }

    public UsuarioDTO buscarPorId(Integer id, Authentication authentication) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario no encontrado."));

        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        if (idEmpresaActual != null) {
            Integer idEmpresaUsuario = usuario.getEmpresa() != null ? usuario.getEmpresa().getIdEmpresa() : null;
            if (!tenantContext.coincideEmpresa(idEmpresaUsuario, idEmpresaActual)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado.");
            }
        }

        return convertirADto(usuario);
    }

    public UsuarioDTO crear(UsuarioRequestDTO request, Authentication authentication) {
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        Rol rol = rolRepository.findById(request.idRol())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Rol no encontrado con ID: " + request.idRol()));

        if (Boolean.TRUE.equals(rol.getEsProtegido()) && !tenantContext.esAdminGlobalAutenticado(authentication)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes asignar un rol protegido.");
        }

        if (idEmpresaActual != null) {
            Integer idEmpresaRol = rol.getEmpresa() != null ? rol.getEmpresa().getIdEmpresa() : null;
            if (!tenantContext.coincideEmpresa(idEmpresaRol, idEmpresaActual)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Rol no encontrado.");
            }
        } else {
            if (rol.getEmpresa() != null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Rol no encontrado.");
            }
        }

        Empresa empresa = null;
        if (idEmpresaActual != null) {
            empresa = empresaRepository.findById(idEmpresaActual)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Empresa no encontrada con ID: " + idEmpresaActual));
        }

        String correoLimpio = request.correoUsuario() != null ? request.correoUsuario().trim() : null;
        if (correoLimpio != null && usuarioRepository.existsByCorreoUsuario(correoLimpio)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este correo ya está registrado por otro usuario.");
        }

        Usuario usuario = Usuario.builder()
                .empresa(empresa)
                .nombreUsuario(request.nombreUsuario())
                .correoUsuario(request.correoUsuario())
                .rol(rol)
                .contrasenaHash(passwordEncoder.encode(request.contrasenaHash()))
                .cuentaActiva(true)
                .fechaCreacion(LocalDateTime.now())
                .requiereCambioPassword(false)
                .intentosFallidos(0)
                .build();
        Usuario guardado = usuarioRepository.save(usuario);
        return convertirADto(guardado);
    }

    public UsuarioDTO actualizar(Integer id, UsuarioRequestDTO request, Authentication authentication) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario no encontrado."));

        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        if (idEmpresaActual != null) {
            Integer idEmpresaUsuario = usuario.getEmpresa() != null ? usuario.getEmpresa().getIdEmpresa() : null;
            if (!tenantContext.coincideEmpresa(idEmpresaUsuario, idEmpresaActual)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado.");
            }
        }

        Usuario usuarioAutenticado = usuarioRepository.findByCorreoUsuario(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No autenticado."));
        if (usuario.getIdUsuario().equals(usuarioAutenticado.getIdUsuario())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes modificar tu propio usuario desde aquí. Usa Mi Perfil.");
        }

        if (usuario.getRol() != null && Boolean.TRUE.equals(usuario.getRol().getEsProtegido())) {
            Integer idEmpresaDelRol = usuario.getRol().getEmpresa() != null
                    ? usuario.getRol().getEmpresa().getIdEmpresa() : null;
            if (idEmpresaDelRol == null || !tenantContext.esAdminGlobalAutenticado(authentication)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Este usuario está protegido y no puede modificarse desde aquí.");
            }
        }

        Rol rol = rolRepository.findById(request.idRol())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Rol no encontrado con ID: " + request.idRol()));

        if (Boolean.TRUE.equals(rol.getEsProtegido()) && !tenantContext.esAdminGlobalAutenticado(authentication)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes asignar un rol protegido.");
        }

        if (idEmpresaActual != null) {
            Integer idEmpresaRol = rol.getEmpresa() != null ? rol.getEmpresa().getIdEmpresa() : null;
            if (!tenantContext.coincideEmpresa(idEmpresaRol, idEmpresaActual)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Rol no encontrado.");
            }
        } else if (!tenantContext.esAdminGlobalAutenticado(authentication)) {
            if (rol.getEmpresa() != null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Rol no encontrado.");
            }
        }

        String correoLimpio = request.correoUsuario() != null ? request.correoUsuario().trim() : null;
        if (correoLimpio != null
                && !correoLimpio.equals(usuario.getCorreoUsuario())
                && usuarioRepository.existsByCorreoUsuario(correoLimpio)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este correo ya está registrado por otro usuario.");
        }

        usuario.setNombreUsuario(request.nombreUsuario());
        usuario.setCorreoUsuario(request.correoUsuario());
        usuario.setRol(rol);
        usuario.setCuentaActiva(request.cuentaActiva());
        if (request.contrasenaHash() != null && !request.contrasenaHash().isBlank()) {
            usuario.setContrasenaHash(passwordEncoder.encode(request.contrasenaHash()));
            usuario.setFechaUltimoCambioPassword(LocalDateTime.now());
        }
        Usuario actualizado = usuarioRepository.save(usuario);
        return convertirADto(actualizado);
    }

    public void eliminar(Integer id, Authentication authentication) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario no encontrado."));

        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        if (idEmpresaActual != null) {
            Integer idEmpresaUsuario = usuario.getEmpresa() != null ? usuario.getEmpresa().getIdEmpresa() : null;
            if (!tenantContext.coincideEmpresa(idEmpresaUsuario, idEmpresaActual)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado.");
            }
        }

        Usuario usuarioAutenticado = usuarioRepository.findByCorreoUsuario(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No autenticado."));
        if (usuario.getIdUsuario().equals(usuarioAutenticado.getIdUsuario())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes eliminar tu propia cuenta.");
        }

        if (usuario.getRol() != null && Boolean.TRUE.equals(usuario.getRol().getEsProtegido())) {
            Integer idEmpresaDelRol = usuario.getRol().getEmpresa() != null
                    ? usuario.getRol().getEmpresa().getIdEmpresa() : null;
            if (idEmpresaDelRol == null || !tenantContext.esAdminGlobalAutenticado(authentication)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Este usuario está protegido y no puede eliminarse.");
            }
        }

        usuario.setCorreoUsuario("eliminado_" + usuario.getIdUsuario() + "@eliminado.local");
        usuario.setCuentaActiva(false);
        usuarioRepository.save(usuario);
    }

    public UsuarioDTO cambiarEstado(Integer id, boolean nuevoEstado, Authentication authentication) {
        Usuario usuarioAutenticado = usuarioRepository.findByCorreoUsuario(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No autenticado."));

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));

        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        if (idEmpresaActual != null) {
            Integer idEmpresaUsuario = usuario.getEmpresa() != null ? usuario.getEmpresa().getIdEmpresa() : null;
            if (!tenantContext.coincideEmpresa(idEmpresaUsuario, idEmpresaActual)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado.");
            }
        }

        if (usuario.getIdUsuario().equals(usuarioAutenticado.getIdUsuario())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes desactivar tu propia cuenta.");
        }

        if (usuario.getRol() != null && Boolean.TRUE.equals(usuario.getRol().getEsProtegido())) {
            Integer idEmpresaDelRol = usuario.getRol().getEmpresa() != null
                    ? usuario.getRol().getEmpresa().getIdEmpresa() : null;
            if (idEmpresaDelRol == null || !tenantContext.esAdminGlobalAutenticado(authentication)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Este usuario está protegido y no puede modificarse desde aquí.");
            }
        }

        usuario.setCuentaActiva(nuevoEstado);
        Usuario actualizado = usuarioRepository.save(usuario);
        return convertirADto(actualizado);
    }

    private UsuarioDTO convertirADto(Usuario usuario) {
        return new UsuarioDTO(
                usuario.getIdUsuario(),
                usuario.getNombreUsuario(),
                usuario.getCorreoUsuario(),
                usuario.getRol() != null ? usuario.getRol().getIdRol() : null,
                usuario.getCuentaActiva(),
                usuario.getFechaCreacion(),
                usuario.getFechaUltimoCambioPassword(),
                usuario.getRequiereCambioPassword(),
                usuario.getIntentosFallidos(),
                usuario.getBloqueadoHasta(),
                usuario.getUltimoAcceso(),
                usuario.getEmpresa() != null ? usuario.getEmpresa().getIdEmpresa() : null
        );
    }
}