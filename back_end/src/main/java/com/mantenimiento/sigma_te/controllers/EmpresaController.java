package com.mantenimiento.sigma_te.controllers;

import com.mantenimiento.sigma_te.dto.empresa.EmpresaRegistroDTO;
import com.mantenimiento.sigma_te.dto.empresa.EmpresaResponseDTO;
import com.mantenimiento.sigma_te.models.Rol;
import com.mantenimiento.sigma_te.models.Usuario;
import com.mantenimiento.sigma_te.repositories.UsuarioRepository;
import com.mantenimiento.sigma_te.services.EmpresaService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    private final EmpresaService empresaService;
    private final UsuarioRepository usuarioRepository;

    public EmpresaController(EmpresaService empresaService, UsuarioRepository usuarioRepository) {
        this.empresaService = empresaService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmpresaResponseDTO crearEmpresa(
            @RequestBody EmpresaRegistroDTO request,
            Authentication authentication) {

        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No autenticado.");
        }

        String correoActual = authentication.getName();
        Usuario usuario = usuarioRepository.findByCorreoUsuario(correoActual)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario autenticado no encontrado."));

        Rol rol = usuario.getRol();
        if (rol == null
                || !Boolean.TRUE.equals(rol.getEsProtegido())
                || rol.getEmpresa() != null
                || usuario.getEmpresa() != null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo el Administrador global puede registrar empresas.");
        }

        return empresaService.registrarEmpresaConAdmin(request);
    }
}
