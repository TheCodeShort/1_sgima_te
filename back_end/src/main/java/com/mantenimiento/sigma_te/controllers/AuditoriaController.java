package com.mantenimiento.sigma_te.controllers;

import com.mantenimiento.sigma_te.dto.auditoria.AuditoriaDTO;
import com.mantenimiento.sigma_te.dto.auditoria.AuditoriaRequestDTO;
import com.mantenimiento.sigma_te.services.AuditoriaService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
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
@RequestMapping("/api/auditorias")
public class AuditoriaController {

    private final AuditoriaService auditoriaService;

    public AuditoriaController(AuditoriaService auditoriaService) {
        this.auditoriaService = auditoriaService;
    }

    @GetMapping
    public List<AuditoriaDTO> listarTodos(Authentication authentication) {
        return auditoriaService.listarTodos(authentication);
    }

    @GetMapping("/{id}")
    public AuditoriaDTO buscarPorId(@PathVariable Integer id, Authentication authentication) {
        return auditoriaService.buscarPorId(id, authentication);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AuditoriaDTO crear(@RequestBody AuditoriaRequestDTO request, Authentication authentication) {
        return auditoriaService.crear(request, authentication);
    }

    @PutMapping("/{id}")
    public AuditoriaDTO actualizar(@PathVariable Integer id, @RequestBody AuditoriaRequestDTO request, Authentication authentication) {
        return auditoriaService.actualizar(id, request, authentication);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id, Authentication authentication) {
        auditoriaService.eliminar(id, authentication);
    }
}