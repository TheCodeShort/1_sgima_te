package com.mantenimiento.sigma_te.services;

import com.mantenimiento.sigma_te.dto.permiso.PermisoDTO;
import com.mantenimiento.sigma_te.dto.permiso.PermisoRequestDTO;
import com.mantenimiento.sigma_te.models.Permiso;
import com.mantenimiento.sigma_te.repositories.PermisoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PermisoService {

    private final PermisoRepository permisoRepository;

    public PermisoService(PermisoRepository permisoRepository) {
        this.permisoRepository = permisoRepository;
    }

    public List<PermisoDTO> listarTodos() {
        return permisoRepository.findAll()
                .stream()
                .map(this::convertirADto)
                .toList();
    }

    public PermisoDTO buscarPorId(Integer id) {
        Permiso permiso = permisoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Permiso no encontrado con ID: " + id));
        return convertirADto(permiso);
    }

    public PermisoDTO crear(PermisoRequestDTO request) {
        Permiso permiso = Permiso.builder()
                .nombrePermiso(request.nombrePermiso())
                .modulo(request.modulo())
                .build();
        Permiso guardado = permisoRepository.save(permiso);
        return convertirADto(guardado);
    }

    public PermisoDTO actualizar(Integer id, PermisoRequestDTO request) {
        Permiso permiso = permisoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Permiso no encontrado con ID: " + id));
        permiso.setNombrePermiso(request.nombrePermiso());
        permiso.setModulo(request.modulo());
        Permiso actualizado = permisoRepository.save(permiso);
        return convertirADto(actualizado);
    }

    public void eliminar(Integer id) {
        if (!permisoRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Permiso no encontrado con ID: " + id);
        }
        permisoRepository.deleteById(id);
    }

    private PermisoDTO convertirADto(Permiso permiso) {
        return new PermisoDTO(
                permiso.getIdPermiso(),
                permiso.getNombrePermiso(),
                permiso.getModulo()
        );
    }
}
