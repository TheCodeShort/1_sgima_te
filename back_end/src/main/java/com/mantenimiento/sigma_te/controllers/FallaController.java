package com.mantenimiento.sigma_te.controllers;

import com.mantenimiento.sigma_te.dto.falla.FallaDTO;
import com.mantenimiento.sigma_te.dto.falla.FallaRequestDTO;
import com.mantenimiento.sigma_te.services.FallaService;
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
@RequestMapping("/api/fallas")
public class FallaController {

    private final FallaService fallaService;

    public FallaController(FallaService fallaService) {
        this.fallaService = fallaService;
    }

    @GetMapping
    public List<FallaDTO> listarTodos() {
        return fallaService.listarTodos();
    }

    @GetMapping("/{id}")
    public FallaDTO buscarPorId(@PathVariable Integer id) {
        return fallaService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(value = HttpStatus.CREATED, reason = "Se creo una nueva falla")
    public FallaDTO crear(@RequestBody FallaRequestDTO request) {
        return fallaService.crear(request);
    }

    @PutMapping("/{id}")
    public FallaDTO actualizar(@PathVariable Integer id, @RequestBody FallaRequestDTO request) {
        return fallaService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(value = HttpStatus.NO_CONTENT, reason = "Se borro una falla")
    public void eliminar(@PathVariable Integer id) {
        fallaService.eliminar(id);
    }
}
