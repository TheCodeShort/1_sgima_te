package com.mantenimiento.sigma_te.controllers;

import com.mantenimiento.sigma_te.dtos.RolDTO;
import com.mantenimiento.sigma_te.services.RolService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Le avisa a Spring Boot: "Oye, esta clase es un Controlador de tipo REST".
@RequestMapping("/api/roles") // Define la URL base (la dirección de internet) para entrar a este
public class RolController {

    private final RolService rolService;

    public RolController(RolService rolService) {
        this.rolService = rolService;
    }

    @GetMapping
    public List<RolDTO> listarTodos() {
        return rolService.listarTodos();
    }

    @GetMapping("/{id}")
    public RolDTO buscarPorId(@PathVariable Integer id) {
        return rolService.buscarPorId(id);
    }
}
