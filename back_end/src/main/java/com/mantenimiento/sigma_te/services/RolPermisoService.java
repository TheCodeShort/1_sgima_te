package com.mantenimiento.sigma_te.services;

import com.mantenimiento.sigma_te.dto.rolpermiso.RolPermisoDTO;
import com.mantenimiento.sigma_te.dto.rolpermiso.RolPermisoRequestDTO;
import com.mantenimiento.sigma_te.models.Rol;
import com.mantenimiento.sigma_te.models.RolPermiso;
import com.mantenimiento.sigma_te.models.RolPermisoId;
import com.mantenimiento.sigma_te.models.Usuario;
import com.mantenimiento.sigma_te.repositories.PermisoRepository;
import com.mantenimiento.sigma_te.repositories.RolPermisoRepository;
import com.mantenimiento.sigma_te.repositories.RolRepository;
import com.mantenimiento.sigma_te.repositories.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RolPermisoService {

    private final RolPermisoRepository rolPermisoRepository;
    private final RolRepository rolRepository;
    private final PermisoRepository permisoRepository;
    private final UsuarioRepository usuarioRepository;

    public RolPermisoService(RolPermisoRepository rolPermisoRepository,
                             RolRepository rolRepository,
                             PermisoRepository permisoRepository,
                             UsuarioRepository usuarioRepository) {
        this.rolPermisoRepository = rolPermisoRepository;
        this.rolRepository = rolRepository;
        this.permisoRepository = permisoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<RolPermisoDTO> listarTodos() {
        return rolPermisoRepository.findAll()
                .stream()
                .map(this::convertirADto)
                .toList();
    }

    public RolPermisoDTO buscarPorId(Integer idRol, Integer idPermiso) {
        RolPermisoId id = new RolPermisoId(idRol, idPermiso);
        RolPermiso rolPermiso = rolPermisoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "RolPermiso no encontrado para idRol: " + idRol + " e idPermiso: " + idPermiso));
        return convertirADto(rolPermiso);
    }

    public RolPermisoDTO crear(RolPermisoRequestDTO request) {
        return crear(request, SecurityContextHolder.getContext().getAuthentication());
    }

    public RolPermisoDTO crear(RolPermisoRequestDTO request, Authentication authentication) {
        if (!rolRepository.existsById(request.idRol())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Rol no encontrado con ID: " + request.idRol());
        }

        Rol rol = rolRepository.findById(request.idRol()).orElse(null);
        validarModificacionRol(rol, authentication);

        if (!permisoRepository.existsById(request.idPermiso())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Permiso no encontrado con ID: " + request.idPermiso());
        }

        RolPermisoId id = new RolPermisoId(request.idRol(), request.idPermiso());
        if (rolPermisoRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La asignacion RolPermiso ya existe para idRol: " + request.idRol() + " e idPermiso: " + request.idPermiso());
        }

        RolPermiso rolPermiso = RolPermiso.builder()
                .id(id)
                .fechaAsignacion(LocalDateTime.now())
                .build();

        RolPermiso guardado = rolPermisoRepository.save(rolPermiso);
        return convertirADto(guardado);
    }

    public RolPermisoDTO actualizar(Integer idRol, Integer idPermiso, RolPermisoRequestDTO request) {
        return actualizar(idRol, idPermiso, request, SecurityContextHolder.getContext().getAuthentication());
    }

    public RolPermisoDTO actualizar(Integer idRol, Integer idPermiso, RolPermisoRequestDTO request, Authentication authentication) {
        RolPermisoId idExistente = new RolPermisoId(idRol, idPermiso);
        RolPermiso rolPermisoExistente = rolPermisoRepository.findById(idExistente)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "RolPermiso no encontrado para idRol: " + idRol + " e idPermiso: " + idPermiso));

        Rol origen = rolRepository.findById(idRol).orElse(null);
        validarModificacionRol(origen, authentication);

        Rol rol = rolRepository.findById(request.idRol()).orElse(null);
        validarModificacionRol(rol, authentication);

        if (!idRol.equals(request.idRol()) || !idPermiso.equals(request.idPermiso())) {
            if (!rolRepository.existsById(request.idRol())) {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Rol no encontrado con ID: " + request.idRol());
            }
            if (!permisoRepository.existsById(request.idPermiso())) {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Permiso no encontrado con ID: " + request.idPermiso());
            }

            RolPermisoId nuevoId = new RolPermisoId(request.idRol(), request.idPermiso());
            if (rolPermisoRepository.existsById(nuevoId)) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "La asignacion RolPermiso ya existe para idRol: " + request.idRol() + " e idPermiso: " + request.idPermiso());
            }

            rolPermisoRepository.deleteById(idExistente);

            RolPermiso nuevoRolPermiso = RolPermiso.builder()
                    .id(nuevoId)
                    .fechaAsignacion(LocalDateTime.now())
                    .build();

            RolPermiso guardado = rolPermisoRepository.save(nuevoRolPermiso);
            return convertirADto(guardado);
        }

        rolPermisoExistente.setFechaAsignacion(LocalDateTime.now());
        RolPermiso actualizado = rolPermisoRepository.save(rolPermisoExistente);
        return convertirADto(actualizado);
    }

    public void eliminar(Integer idRol, Integer idPermiso) {
        eliminar(idRol, idPermiso, SecurityContextHolder.getContext().getAuthentication());
    }

    public void eliminar(Integer idRol, Integer idPermiso, Authentication authentication) {
        RolPermisoId id = new RolPermisoId(idRol, idPermiso);
        if (!rolPermisoRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "RolPermiso no encontrado para idRol: " + idRol + " e idPermiso: " + idPermiso);
        }

        Rol rol = rolRepository.findById(idRol).orElse(null);
        validarModificacionRol(rol, authentication);

        rolPermisoRepository.deleteById(id);
    }

    private void validarModificacionRol(Rol rol, Authentication authentication) {
        if (rol != null && Boolean.TRUE.equals(rol.getEsProtegido())) {
            if (rol.getEmpresa() == null || !esAdminGlobalAutenticado(authentication)) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "No se pueden modificar los permisos de un rol protegido.");
            }
        }
    }

    private boolean esAdminGlobalAutenticado(Authentication authentication) {
        Authentication auth = authentication != null
                ? authentication
                : SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getName() == null) {
            return false;
        }

        return usuarioRepository.findByCorreoUsuario(auth.getName())
                .map(usuario -> {
                    Rol rol = usuario.getRol();
                    return rol != null
                            && Boolean.TRUE.equals(rol.getEsProtegido())
                            && rol.getEmpresa() == null;
                })
                .orElse(false);
    }

    private RolPermisoDTO convertirADto(RolPermiso rolPermiso) {
        return new RolPermisoDTO(
                rolPermiso.getId() != null ? rolPermiso.getId().getIdRol() : null,
                rolPermiso.getId() != null ? rolPermiso.getId().getIdPermiso() : null,
                rolPermiso.getFechaAsignacion()
        );
    }

    public List<String> obtenerPermisosEfectivos(Usuario usuario) {
        if (usuario == null || usuario.getRol() == null) {
            return List.of();
        }

        Rol rol = usuario.getRol();
        if (Boolean.TRUE.equals(rol.getEsProtegido()) && rol.getEmpresa() == null) {
            return permisoRepository.findAllNombresPermiso();
        }

        return rolPermisoRepository.findNombresPermisoByIdRol(rol.getIdRol());
    }
}

