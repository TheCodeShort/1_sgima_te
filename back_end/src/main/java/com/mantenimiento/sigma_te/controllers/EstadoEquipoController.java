package com.mantenimiento.sigma_te.controllers;


import com.mantenimiento.sigma_te.dto.estadoequipo.EstadoEquipoDTO;
import com.mantenimiento.sigma_te.dto.estadoequipo.EstadoEquipoRequestDTO;
import com.mantenimiento.sigma_te.services.EstadoEquipoService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estados-equipo")
public class EstadoEquipoController {

	private final EstadoEquipoService estadoEquipoService;

    public EstadoEquipoController(EstadoEquipoService estadoEquipoService) {
        this.estadoEquipoService = estadoEquipoService;
    }

    @GetMapping
    public List<EstadoEquipoDTO> listarTodos() {
        return estadoEquipoService.listarTodos();
    }

    @GetMapping("/{id}")
    public EstadoEquipoDTO buscarPorId(@PathVariable Integer id) {
        return estadoEquipoService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EstadoEquipoDTO crear(@RequestBody EstadoEquipoRequestDTO request) {
        return estadoEquipoService.crear(request);
    }

    @PutMapping("/{id}")
    public EstadoEquipoDTO actualizar(@PathVariable Integer id, @RequestBody EstadoEquipoRequestDTO request) {
        return estadoEquipoService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        estadoEquipoService.eliminar(id);
    }
}
