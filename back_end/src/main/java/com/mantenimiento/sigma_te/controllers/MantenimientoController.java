package com.mantenimiento.sigma_te.controllers;

import com.mantenimiento.sigma_te.dto.mantenimiento.MantenimientoDTO;
import com.mantenimiento.sigma_te.dto.mantenimiento.MantenimientoRequestDTO;
import com.mantenimiento.sigma_te.services.MantenimientoService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/mantenimientos")
public class MantenimientoController {

    private final MantenimientoService mantenimientoService;

    public MantenimientoController(MantenimientoService mantenimientoService) {
        this.mantenimientoService = mantenimientoService;
    }

    @GetMapping
    public List<MantenimientoDTO> listarTodos() {
        return mantenimientoService.listarTodos();
    }

    @GetMapping("/{id}")
    public MantenimientoDTO buscarPorId(@PathVariable Integer id) {
        return mantenimientoService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(value = HttpStatus.CREATED, reason = "Se creo un nuevo mantenimiento")
    public MantenimientoDTO crear(@RequestBody MantenimientoRequestDTO request) {
        return mantenimientoService.crear(request);
    }

    @PutMapping("/{id}")
    public MantenimientoDTO actualizar(@PathVariable Integer id, @RequestBody MantenimientoRequestDTO request) {
        return mantenimientoService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(value = HttpStatus.NO_CONTENT, reason = "Se borro un mantenimiento")
    public void eliminar(@PathVariable Integer id) {
        mantenimientoService.eliminar(id);
    }
}
