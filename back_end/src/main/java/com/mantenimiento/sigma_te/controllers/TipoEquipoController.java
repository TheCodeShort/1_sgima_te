package com.mantenimiento.sigma_te.controllers;

import com.mantenimiento.sigma_te.dto.tipoequipo.TipoEquipoDTO;
import com.mantenimiento.sigma_te.services.TipoEquipoService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-equipo")
public class TipoEquipoController {

    private final TipoEquipoService tipoEquipoService;

    public TipoEquipoController(TipoEquipoService tipoEquipoService) {
        this.tipoEquipoService = tipoEquipoService;
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'ver_equipos')")
    @GetMapping
    public List<TipoEquipoDTO> listarActivos() {
        return tipoEquipoService.listarActivos();
    }
}