package com.mantenimiento.sigma_te.services;

import com.mantenimiento.sigma_te.repositories.FallaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FallaService {

    private final FallaRepository fallaRepository;

    @Autowired
    public FallaService(FallaRepository fallaRepository) {
        this.fallaRepository = fallaRepository;
    }
}
