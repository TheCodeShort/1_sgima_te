package com.mantenimiento.sigma_te.controllers;

import com.mantenimiento.sigma_te.dto.rol.RolDTO;
import com.mantenimiento.sigma_te.dto.rol.RolRequestDTO;
import com.mantenimiento.sigma_te.services.RolService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
// Representational State Transfer (Transferencia de Estado Representacional)
@RestController // Le avisa a Spring Boot: "Oye, esta clase es un Controlador de tipo REST".
@RequestMapping("/api/roles") // Define la URL base (la dirección de internet) para entrar a este
public class RolController {

    private final RolService rolService;

    public RolController(RolService rolService) {
        this.rolService = rolService;
    }

    // para ver todos los datos de la DB
    @GetMapping
    public List<RolDTO> listarTodos() {
        return rolService.listarTodos();
    }
    // para ver solo un dato por ID
    @GetMapping("/{id}")
    public RolDTO buscarPorId(@PathVariable Integer id) {
        return rolService.buscarPorId(id);
    }
    // para crear un nuevo rol
    @PostMapping
    @ResponseStatus(value = HttpStatus.CREATED, reason = "Se creo un nuevo usuario")
    public RolDTO crear(@RequestBody RolRequestDTO request) {
        return rolService.crear(request);
    }

    @PutMapping("/{id}")
    public RolDTO actualizar(@PathVariable Integer id, @RequestBody RolRequestDTO request) {
        return rolService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(value = HttpStatus.NO_CONTENT, reason = "Se borro un Rol")
    public void eliminar(@PathVariable Integer id) {
        rolService.eliminar(id);
    }
}