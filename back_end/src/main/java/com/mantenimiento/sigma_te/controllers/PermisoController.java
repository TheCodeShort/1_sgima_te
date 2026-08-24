package com.mantenimiento.sigma_te.controllers;

import com.mantenimiento.sigma_te.dto.permiso.PermisoDTO;
import com.mantenimiento.sigma_te.dto.permiso.PermisoRequestDTO;
import com.mantenimiento.sigma_te.services.PermisoService;
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
@RequestMapping("/api/permisos")
public class PermisoController {

    private final PermisoService permisoService;

    public PermisoController(PermisoService permisoService) {
        this.permisoService = permisoService;
    }

    @GetMapping
    public List<PermisoDTO> listarTodos() {
        return permisoService.listarTodos();
    }

    @GetMapping("/{id}")
    public PermisoDTO buscarPorId(@PathVariable Integer id) {
        return permisoService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(value = HttpStatus.CREATED, reason = "Se creo un nuevo permiso")
    public PermisoDTO crear(@RequestBody PermisoRequestDTO request) {
        return permisoService.crear(request);
    }

    @PutMapping("/{id}")
    public PermisoDTO actualizar(@PathVariable Integer id, @RequestBody PermisoRequestDTO request) {
        return permisoService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(value = HttpStatus.NO_CONTENT, reason = "Se borro un permiso")
    public void eliminar(@PathVariable Integer id) {
        permisoService.eliminar(id);
    }
}
