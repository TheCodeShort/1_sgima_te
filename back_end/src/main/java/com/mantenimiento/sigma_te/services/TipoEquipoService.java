package com.mantenimiento.sigma_te.services;

import com.mantenimiento.sigma_te.dto.tipoequipo.TipoEquipoDTO;
import com.mantenimiento.sigma_te.models.TipoEquipo;
import com.mantenimiento.sigma_te.repositories.TipoEquipoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TipoEquipoService {

    private final TipoEquipoRepository tipoEquipoRepository;

    public TipoEquipoService(TipoEquipoRepository tipoEquipoRepository) {
        this.tipoEquipoRepository = tipoEquipoRepository;
    }

    public List<TipoEquipoDTO> listarActivos() {
        return tipoEquipoRepository.findByActivoTrueOrderByIdTipoEquipoAsc()
                .stream()
                .map(this::convertirADto)
                .toList();
    }

    private TipoEquipoDTO convertirADto(TipoEquipo tipoEquipo) {
        return new TipoEquipoDTO(
                tipoEquipo.getIdTipoEquipo(),
                tipoEquipo.getNombreTipo()
        );
    }
}