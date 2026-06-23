package com.mantenimiento.sigma_te.services;

import com.mantenimiento.sigma_te.repositories.EquipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EquipoService {

    private final EquipoRepository equipoRepository;

    @Autowired
    public EquipoService(EquipoRepository equipoRepository) {
        this.equipoRepository = equipoRepository;
    }
}
