package com.mantenimiento.sigma_te.controllers;

import com.mantenimiento.sigma_te.dto.empresa.CambiarEstadoDTO;
import com.mantenimiento.sigma_te.dto.empresa.EmpresaListadoDTO;
import com.mantenimiento.sigma_te.dto.empresa.EmpresaRegistroDTO;
import com.mantenimiento.sigma_te.dto.empresa.EmpresaResponseDTO;
import com.mantenimiento.sigma_te.dto.empresa.EmpresaUpdateDTO;
import com.mantenimiento.sigma_te.models.Rol;
import com.mantenimiento.sigma_te.models.Usuario;
import com.mantenimiento.sigma_te.repositories.UsuarioRepository;
import com.mantenimiento.sigma_te.services.EmpresaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    private final EmpresaService empresaService;
    private final UsuarioRepository usuarioRepository;

    public EmpresaController(EmpresaService empresaService, UsuarioRepository usuarioRepository) {
        this.empresaService = empresaService;
        this.usuarioRepository = usuarioRepository;
    }

    private void validarUsuarioMain(Authentication authentication) {
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
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmpresaResponseDTO crearEmpresa(
            @RequestBody EmpresaRegistroDTO request,
            Authentication authentication) {
        validarUsuarioMain(authentication);
        return empresaService.registrarEmpresaConAdmin(request);
    }

    @GetMapping
    public List<EmpresaListadoDTO> listarTodos(Authentication authentication) {
        validarUsuarioMain(authentication);
        return empresaService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpresaResponseDTO> buscarPorId(
            @PathVariable Integer id,
            Authentication authentication) {
        validarUsuarioMain(authentication);
        EmpresaResponseDTO dto = empresaService.buscarPorId(id);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmpresaResponseDTO> actualizar(
            @PathVariable Integer id,
            @RequestBody EmpresaUpdateDTO request,
            Authentication authentication) {
        validarUsuarioMain(authentication);
        EmpresaResponseDTO dto = empresaService.actualizar(id, request);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> eliminar(
            @PathVariable Integer id,
            Authentication authentication) {
        validarUsuarioMain(authentication);
        empresaService.eliminar(id);
        Map<String, String> respuesta = Map.of("mensaje", "Empresa eliminada correctamente.");
        return ResponseEntity.ok(respuesta);
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<EmpresaResponseDTO> cambiarEstado(
            @PathVariable Integer id,
            @RequestBody CambiarEstadoDTO request,
            Authentication authentication) {
        validarUsuarioMain(authentication);
        EmpresaResponseDTO dto = empresaService.cambiarEstado(id, request);
        return ResponseEntity.ok(dto);
    }
}
