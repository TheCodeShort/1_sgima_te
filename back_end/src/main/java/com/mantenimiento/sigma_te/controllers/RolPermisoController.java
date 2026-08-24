package com.mantenimiento.sigma_te.controllers;

import com.mantenimiento.sigma_te.dto.rolpermiso.RolPermisoDTO;
import com.mantenimiento.sigma_te.dto.rolpermiso.RolPermisoRequestDTO;
import com.mantenimiento.sigma_te.services.RolPermisoService;
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
@RequestMapping("/api/rol-permisos")
public class RolPermisoController {

    private final RolPermisoService rolPermisoService;

    public RolPermisoController(RolPermisoService rolPermisoService) {
        this.rolPermisoService = rolPermisoService;
    }

    @GetMapping
    public List<RolPermisoDTO> listarTodos() {
        return rolPermisoService.listarTodos();
    }

    @GetMapping("/{idRol}/{idPermiso}")
    public RolPermisoDTO buscarPorId(@PathVariable Integer idRol, @PathVariable Integer idPermiso) {
        return rolPermisoService.buscarPorId(idRol, idPermiso);
    }

    @PostMapping
    @ResponseStatus(value = HttpStatus.CREATED, reason = "Se creo una nueva asignacion rol-permiso")
    public RolPermisoDTO crear(@RequestBody RolPermisoRequestDTO request) {
        return rolPermisoService.crear(request);
    }

    @PutMapping("/{idRol}/{idPermiso}")
    public RolPermisoDTO actualizar(@PathVariable Integer idRol,
                                   @PathVariable Integer idPermiso,
                                   @RequestBody RolPermisoRequestDTO request) {
        return rolPermisoService.actualizar(idRol, idPermiso, request);
    }

    @DeleteMapping("/{idRol}/{idPermiso}")
    @ResponseStatus(value = HttpStatus.NO_CONTENT, reason = "Se borro la asignacion rol-permiso")
    public void eliminar(@PathVariable Integer idRol, @PathVariable Integer idPermiso) {
        rolPermisoService.eliminar(idRol, idPermiso);
    }
}
