package com.mantenimiento.sigma_te.controllers;

import com.mantenimiento.sigma_te.dto.mantenimiento.MantenimientoDTO;
import com.mantenimiento.sigma_te.dto.mantenimiento.MantenimientoRequestDTO;
import com.mantenimiento.sigma_te.services.MantenimientoService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
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
@RequestMapping("/api/mantenimientos")
public class MantenimientoController {

    private final MantenimientoService mantenimientoService;

    public MantenimientoController(MantenimientoService mantenimientoService) {
        this.mantenimientoService = mantenimientoService;
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'registrar_mantenimiento')")
    @GetMapping
    public List<MantenimientoDTO> listarTodos(Authentication authentication) {
        return mantenimientoService.listarTodos(authentication);
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'registrar_mantenimiento')")
    @GetMapping("/{id}")
    public MantenimientoDTO buscarPorId(@PathVariable Integer id, Authentication authentication) {
        return mantenimientoService.buscarPorId(id, authentication);
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'registrar_mantenimiento')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MantenimientoDTO crear(@RequestBody MantenimientoRequestDTO request, Authentication authentication) {
        return mantenimientoService.crear(request, authentication);
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'registrar_mantenimiento')")
    @PutMapping("/{id}")
    public MantenimientoDTO actualizar(@PathVariable Integer id, @RequestBody MantenimientoRequestDTO request, Authentication authentication) {
        return mantenimientoService.actualizar(id, request, authentication);
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'registrar_mantenimiento')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id, Authentication authentication) {
        mantenimientoService.eliminar(id, authentication);
    }
}
