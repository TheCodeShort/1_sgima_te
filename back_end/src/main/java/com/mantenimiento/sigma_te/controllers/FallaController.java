package com.mantenimiento.sigma_te.controllers;

import com.mantenimiento.sigma_te.services.FallaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fallas")
public class FallaController {

    private final FallaService fallaService;

    @Autowired
    public FallaController(FallaService fallaService) {
        this.fallaService = fallaService;
    }
}
