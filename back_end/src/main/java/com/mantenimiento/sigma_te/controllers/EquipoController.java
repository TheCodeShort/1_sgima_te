package com.mantenimiento.sigma_te.controllers;

import com.mantenimiento.sigma_te.dto.empresa.CambiarEstadoDTO;
import com.mantenimiento.sigma_te.dto.equipo.EquipoDTO;
import com.mantenimiento.sigma_te.dto.equipo.EquipoRequestDTO;
import com.mantenimiento.sigma_te.services.EquipoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'ver_equipos')")
    @GetMapping
    public List<EquipoDTO> listarTodos(Authentication authentication) {
        return equipoService.listarTodos(authentication);
    }

    @GetMapping("/empresa/{idEmpresa}")
    public ResponseEntity<List<EquipoDTO>> listarPorEmpresa(
            @PathVariable Integer idEmpresa, Authentication authentication) {
        return ResponseEntity.ok(equipoService.listarPorEmpresa(idEmpresa, authentication));
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'ver_equipos')")
    @GetMapping("/{id}")
    public EquipoDTO buscarPorId(@PathVariable Integer id, Authentication authentication) {
        return equipoService.buscarPorId(id, authentication);
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'ver_equipos')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EquipoDTO crear(@RequestBody EquipoRequestDTO request, Authentication authentication) {
        return equipoService.crear(request, authentication);
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'ver_equipos')")
    @PutMapping("/{id}")
    public EquipoDTO actualizar(@PathVariable Integer id,
                                @RequestBody EquipoRequestDTO request,
                                Authentication authentication) {
        return equipoService.actualizar(id, request, authentication);
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'ver_equipos')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id, Authentication authentication) {
        equipoService.eliminar(id, authentication);
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'ver_equipos')")
    @PatchMapping("/{id}/estado")
    public ResponseEntity<EquipoDTO> cambiarEstado(
            @PathVariable Integer id,
            @RequestBody CambiarEstadoDTO request,
            Authentication authentication) {
        EquipoDTO dto = equipoService.cambiarEstado(id, request, authentication);
        return ResponseEntity.ok(dto);
    }
}



