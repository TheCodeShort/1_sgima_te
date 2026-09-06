package com.mantenimiento.sigma_te.controllers;

import com.mantenimiento.sigma_te.dto.usuario.MiPerfilRequestDTO;
import com.mantenimiento.sigma_te.dto.usuario.UsuarioDTO;
import com.mantenimiento.sigma_te.dto.usuario.UsuarioRequestDTO;
import com.mantenimiento.sigma_te.models.Usuario;
import com.mantenimiento.sigma_te.repositories.UsuarioRepository;
import com.mantenimiento.sigma_te.services.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioController(UsuarioService usuarioService,
                             UsuarioRepository usuarioRepository,
                             PasswordEncoder passwordEncoder) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<UsuarioDTO> listarTodos() {
        return usuarioService.listarTodos();
    }

    @GetMapping("/{id}")
    public UsuarioDTO buscarPorId(@PathVariable Integer id) {
        return usuarioService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioDTO crear(@RequestBody UsuarioRequestDTO request) {
        return usuarioService.crear(request);
    }

    @PutMapping("/{id}")
    public UsuarioDTO actualizar(@PathVariable Integer id, @RequestBody UsuarioRequestDTO request) {
        return usuarioService.actualizar(id, request);
    }

    @PutMapping("/mi-perfil")
    public ResponseEntity<Map<String, String>> actualizarMiPerfil(
            @RequestBody MiPerfilRequestDTO request,
            org.springframework.security.core.Authentication authentication) {

        String correoActual = authentication.getName();

        Usuario usuario = usuarioRepository.findByCorreoUsuario(correoActual)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));

        if (request.contrasenaActual() == null || 
            !passwordEncoder.matches(request.contrasenaActual(), usuario.getContrasenaHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "La contraseña actual es incorrecta.");
        }

        boolean huboCambios = false;

        if (request.nuevoCorreo() != null && !request.nuevoCorreo().isBlank() 
            && !request.nuevoCorreo().equals(usuario.getCorreoUsuario())) {
            usuario.setCorreoUsuario(request.nuevoCorreo().trim());
            huboCambios = true;
        }

        if (request.nuevaContrasena() != null && !request.nuevaContrasena().isBlank()) {
            if (request.nuevaContrasena().length() < 8) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La nueva contraseña debe tener al menos 8 caracteres.");
            }
            usuario.setContrasenaHash(passwordEncoder.encode(request.nuevaContrasena()));
            usuario.setFechaUltimoCambioPassword(java.time.LocalDateTime.now());
            huboCambios = true;
        }

        if (huboCambios) {
            usuarioRepository.save(usuario);
        }

        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Perfil actualizado correctamente.");
        return ResponseEntity.ok(respuesta);
    }

//    @DeleteMapping("/{id}")
//    @ResponseStatus(HttpStatus.NO_CONTENT)
//    public void eliminar(@PathVariable Integer id) {
//        usuarioService.eliminar(id);
//    }
}

