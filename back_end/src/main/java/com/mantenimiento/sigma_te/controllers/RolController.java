package com.mantenimiento.sigma_te.controllers;

import com.mantenimiento.sigma_te.dto.rol.RolDTO;
import com.mantenimiento.sigma_te.dto.rol.RolRequestDTO;
import com.mantenimiento.sigma_te.services.RolService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RolController {

    private final RolService rolService;

    public RolController(RolService rolService) {
        this.rolService = rolService;
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'gestionar_roles')")
    @GetMapping
    public List<RolDTO> listarTodos(Authentication authentication) {
        return rolService.listarTodos(authentication);
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'gestionar_roles')")
    @GetMapping("/{id}")
    public RolDTO buscarPorId(@PathVariable Integer id, Authentication authentication) {
        return rolService.buscarPorId(id, authentication);
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'gestionar_roles')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RolDTO crear(@RequestBody RolRequestDTO request, Authentication authentication) {
        return rolService.crear(request, authentication);
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'gestionar_roles')")
    @PutMapping("/{id}")
    public RolDTO actualizar(@PathVariable Integer id, @RequestBody RolRequestDTO request, Authentication authentication) {
        return rolService.actualizar(id, request, authentication);
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'gestionar_roles')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id, Authentication authentication) {
        rolService.eliminar(id, authentication);
    }
}