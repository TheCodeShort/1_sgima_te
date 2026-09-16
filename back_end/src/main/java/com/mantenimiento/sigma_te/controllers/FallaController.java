package com.mantenimiento.sigma_te.controllers;

import com.mantenimiento.sigma_te.dto.falla.FallaDTO;
import com.mantenimiento.sigma_te.dto.falla.FallaRequestDTO;
import com.mantenimiento.sigma_te.services.FallaService;
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
@RequestMapping("/api/fallas")
public class FallaController {

    private final FallaService fallaService;

    public FallaController(FallaService fallaService) {
        this.fallaService = fallaService;
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'registrar_falla')")
    @GetMapping
    public List<FallaDTO> listarTodos(Authentication authentication) {
        return fallaService.listarTodos(authentication);
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'registrar_falla')")
    @GetMapping("/{id}")
    public FallaDTO buscarPorId(@PathVariable Integer id, Authentication authentication) {
        return fallaService.buscarPorId(id, authentication);
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'registrar_falla')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FallaDTO crear(@RequestBody FallaRequestDTO request, Authentication authentication) {
        return fallaService.crear(request, authentication);
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'registrar_falla')")
    @PutMapping("/{id}")
    public FallaDTO actualizar(@PathVariable Integer id,
                                @RequestBody FallaRequestDTO request,
                                Authentication authentication) {
        return fallaService.actualizar(id, request, authentication);
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'registrar_falla')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id, Authentication authentication) {
        fallaService.eliminar(id, authentication);
    }
}
