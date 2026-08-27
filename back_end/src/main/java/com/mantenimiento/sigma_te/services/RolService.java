package com.mantenimiento.sigma_te.services;

import com.mantenimiento.sigma_te.dto.rol.RolDTO;
import com.mantenimiento.sigma_te.dto.rol.RolRequestDTO;
import com.mantenimiento.sigma_te.models.Rol;
import com.mantenimiento.sigma_te.repositories.RolRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class RolService {

    private final RolRepository rolRepository;

    public RolService(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    public List<RolDTO> listarTodos() {
        return rolRepository.findAll()
                                .stream()
                                .map(this::convertirADto)
                                .toList();
    }

    // Control de Errores Elegante con Excepciones HTTP
    public RolDTO buscarPorId(Integer id) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                                    HttpStatus.NOT_FOUND, "Rol no encontrado con ID: " + id));
        return convertirADto(rol);
    }

    public RolDTO crear(RolRequestDTO request) {
        Rol rol = Rol.builder()
                .nombreRol(request.nombreRol())
                .descripcionRol(request.descripcionRol())
                .estadoRol(true)
                .build();
        Rol guardado = rolRepository.save(rol);
        return convertirADto(guardado);
    }

    public RolDTO actualizar(Integer id, RolRequestDTO request) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Rol no encontrado con ID: " + id));
        rol.setNombreRol(request.nombreRol());
        rol.setDescripcionRol(request.descripcionRol());
        rol.setEstadoRol(request.estadoRol());
        Rol actualizado = rolRepository.save(rol);
        return convertirADto(actualizado);
    }

    public void eliminar(Integer id) {
        if (!rolRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Rol no encontrado con ID: " + id);
        }
        rolRepository.deleteById(id);
    }

    //  El traductor manual (convertirADto)
    private RolDTO convertirADto(Rol rol) {
        return new RolDTO(
                rol.getIdRol(),
                rol.getNombreRol(),
                rol.getDescripcionRol(),
                rol.getEstadoRol()
        );
    }
}
