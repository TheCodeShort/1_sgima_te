package com.mantenimiento.sigma_te.controllers;

import com.mantenimiento.sigma_te.dto.evidencia.EvidenciaDTO;
import com.mantenimiento.sigma_te.dto.evidencia.EvidenciaRequestDTO;
import com.mantenimiento.sigma_te.services.EvidenciaService;
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
@RequestMapping("/api/evidencias")
public class EvidenciaController {

    private final EvidenciaService evidenciaService;

    public EvidenciaController(EvidenciaService evidenciaService) {
        this.evidenciaService = evidenciaService;
    }

    @GetMapping
    public List<EvidenciaDTO> listarTodos() {
        return evidenciaService.listarTodos();
    }

    @GetMapping("/{id}")
    public EvidenciaDTO buscarPorId(@PathVariable Integer id) {
        return evidenciaService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EvidenciaDTO crear(@RequestBody EvidenciaRequestDTO request) {
        return evidenciaService.crear(request);
    }

    @PutMapping("/{id}")
    public EvidenciaDTO actualizar(@PathVariable Integer id, @RequestBody EvidenciaRequestDTO request) {
        return evidenciaService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        evidenciaService.eliminar(id);
    }
}
