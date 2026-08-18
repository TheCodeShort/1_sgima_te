package com.mantenimiento.sigma_te.services;

import com.mantenimiento.sigma_te.dtos.RolDTO;
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
        return rolRepository.findAll().stream()
                .map(this::convertirADto)
                .toList();
    }

    public RolDTO buscarPorId(Integer id) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Rol no encontrado con ID: " + id));
        return convertirADto(rol);
    }

    private RolDTO convertirADto(Rol rol) {
        return new RolDTO(
                rol.getIdRol(),
                rol.getNombreRol(),
                rol.getDescripcionRol(),
                rol.getEstadoRol()
        );
    }
}
