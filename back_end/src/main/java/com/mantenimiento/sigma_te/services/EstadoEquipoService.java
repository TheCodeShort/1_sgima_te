package com.mantenimiento.sigma_te.services;

import com.mantenimiento.sigma_te.dto.estadoequipo.EstadoEquipoDTO;
import com.mantenimiento.sigma_te.dto.estadoequipo.EstadoEquipoRequestDTO;
import com.mantenimiento.sigma_te.models.EstadoEquipo;
import com.mantenimiento.sigma_te.repositories.EstadoEquipoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EstadoEquipoService {
	private final EstadoEquipoRepository estadoEquipoRepository;

	public EstadoEquipoService(EstadoEquipoRepository estadoEquipoRepository) {
		this.estadoEquipoRepository = estadoEquipoRepository;
	}

	  public List<EstadoEquipoDTO> listarTodos() {
        return estadoEquipoRepository.findAll()
                .stream()
                .map(this::convertirADto)
                .toList();
    }

	 public EstadoEquipoDTO buscarPorId(Integer id) {
        EstadoEquipo estadoEquipo = estadoEquipoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Estado de equipo no encontrado con ID: " + id));
        return convertirADto(estadoEquipo);
    }

    public EstadoEquipoDTO crear(EstadoEquipoRequestDTO request) {
        EstadoEquipo estadoEquipo = EstadoEquipo.builder()
                .nombreEstado(request.nombreEstado())
                .descripcionEstado(request.descripcionEstado())
                .permiteOperacion(request.permiteOperacion())
                .build();
        EstadoEquipo guardado = estadoEquipoRepository.save(estadoEquipo);
        return convertirADto(guardado);
    }

    public EstadoEquipoDTO actualizar(Integer id, EstadoEquipoRequestDTO request) {
        EstadoEquipo estadoEquipo = estadoEquipoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Estado de equipo no encontrado con ID: " + id));
        estadoEquipo.setNombreEstado(request.nombreEstado());
        estadoEquipo.setDescripcionEstado(request.descripcionEstado());
        estadoEquipo.setPermiteOperacion(request.permiteOperacion());
        EstadoEquipo actualizado = estadoEquipoRepository.save(estadoEquipo);
        return convertirADto(actualizado);
    }

    public void eliminar(Integer id) {
        if (!estadoEquipoRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Estado de equipo no encontrado con ID: " + id);
        }
        estadoEquipoRepository.deleteById(id);
    }

	private EstadoEquipoDTO convertirADto(EstadoEquipo estadoEquipo) {
        return new EstadoEquipoDTO(
                estadoEquipo.getIdEstadoEquipo(),
                estadoEquipo.getNombreEstado(),
                estadoEquipo.getDescripcionEstado(),
                estadoEquipo.getPermiteOperacion()
        );
    }
}
