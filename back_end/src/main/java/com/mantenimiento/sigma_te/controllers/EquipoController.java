package com.mantenimiento.sigma_te.controllers;

import com.mantenimiento.sigma_te.dto.equipo.EquipoDTO;
import com.mantenimiento.sigma_te.dto.equipo.EquipoRequestDTO;
import com.mantenimiento.sigma_te.services.EquipoService;
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
@RequestMapping("/api/equipos")
public class EquipoController {

    private final EquipoService equipoService;

    public EquipoController(EquipoService equipoService) {
        this.equipoService = equipoService;
    }

    @GetMapping
    public List<EquipoDTO> listarTodos() {
        return equipoService.listarTodos();
    }

    @GetMapping("/{id}")
    public EquipoDTO buscarPorId(@PathVariable Integer id) {
        return equipoService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(value = HttpStatus.CREATED, reason = "Se creo un nuevo equipo")
    public EquipoDTO crear(@RequestBody EquipoRequestDTO request) {
        return equipoService.crear(request);
    }

    @PutMapping("/{id}")
    public EquipoDTO actualizar(@PathVariable Integer id, @RequestBody EquipoRequestDTO request) {
        return equipoService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(value = HttpStatus.NO_CONTENT, reason = "Se borro un equipo")
    public void eliminar(@PathVariable Integer id) {
        equipoService.eliminar(id);
    }
}
