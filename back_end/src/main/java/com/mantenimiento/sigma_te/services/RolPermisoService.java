package com.mantenimiento.sigma_te.services;

import com.mantenimiento.sigma_te.dto.rolpermiso.RolPermisoDTO;
import com.mantenimiento.sigma_te.dto.rolpermiso.RolPermisoRequestDTO;
import com.mantenimiento.sigma_te.models.Rol;
import com.mantenimiento.sigma_te.models.RolPermiso;
import com.mantenimiento.sigma_te.models.RolPermisoId;
import com.mantenimiento.sigma_te.repositories.PermisoRepository;
import com.mantenimiento.sigma_te.repositories.RolPermisoRepository;
import com.mantenimiento.sigma_te.repositories.RolRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RolPermisoService {

    private final RolPermisoRepository rolPermisoRepository;
    private final RolRepository rolRepository;
    private final PermisoRepository permisoRepository;

    public RolPermisoService(RolPermisoRepository rolPermisoRepository,
                             RolRepository rolRepository,
                             PermisoRepository permisoRepository) {
        this.rolPermisoRepository = rolPermisoRepository;
        this.rolRepository = rolRepository;
        this.permisoRepository = permisoRepository;
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
        if (!rolRepository.existsById(request.idRol())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Rol no encontrado con ID: " + request.idRol());
        }

        Rol rol = rolRepository.findById(request.idRol()).orElse(null);
        if (rol != null && Boolean.TRUE.equals(rol.getEsProtegido())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "No se pueden modificar los permisos de un rol protegido.");
        }

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
        RolPermisoId idExistente = new RolPermisoId(idRol, idPermiso);
        RolPermiso rolPermisoExistente = rolPermisoRepository.findById(idExistente)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "RolPermiso no encontrado para idRol: " + idRol + " e idPermiso: " + idPermiso));

        Rol origen = rolRepository.findById(idRol).orElse(null);
        if (origen != null && Boolean.TRUE.equals(origen.getEsProtegido())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "No se pueden modificar los permisos de un rol protegido.");
        }

        Rol rol = rolRepository.findById(request.idRol()).orElse(null);
        if (rol != null && Boolean.TRUE.equals(rol.getEsProtegido())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "No se pueden modificar los permisos de un rol protegido.");
        }

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
        RolPermisoId id = new RolPermisoId(idRol, idPermiso);
        if (!rolPermisoRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "RolPermiso no encontrado para idRol: " + idRol + " e idPermiso: " + idPermiso);
        }

        Rol rol = rolRepository.findById(idRol).orElse(null);
        if (rol != null && Boolean.TRUE.equals(rol.getEsProtegido())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "No se pueden modificar los permisos de un rol protegido.");
        }

        rolPermisoRepository.deleteById(id);
    }

    private RolPermisoDTO convertirADto(RolPermiso rolPermiso) {
        return new RolPermisoDTO(
                rolPermiso.getId() != null ? rolPermiso.getId().getIdRol() : null,
                rolPermiso.getId() != null ? rolPermiso.getId().getIdPermiso() : null,
                rolPermiso.getFechaAsignacion()
        );
    }
}
