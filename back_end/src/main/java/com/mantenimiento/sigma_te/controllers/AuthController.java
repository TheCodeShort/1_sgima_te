package com.mantenimiento.sigma_te.controllers;

import com.mantenimiento.sigma_te.dto.auth.EmergenciaResetDTO;
import com.mantenimiento.sigma_te.dto.auth.LoginRequestDTO;
import com.mantenimiento.sigma_te.dto.auth.LoginResponseDTO;
import com.mantenimiento.sigma_te.models.Usuario;
import com.mantenimiento.sigma_te.repositories.UsuarioRepository;
import com.mantenimiento.sigma_te.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${security.emergencia.clave}")
    private String claveEmergencia;

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Los datos de autenticación no pueden ser nulos.");
        }

        if (request.correo() == null || request.correo().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El correo no puede estar vacío.");
        }

        if (request.contrasena() == null || request.contrasena().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña no puede estar vacía.");
        }

        if (request.contrasena().length() < 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña debe tener al menos 8 caracteres.");
        }

        Usuario usuario = usuarioRepository.findByCorreoUsuario(request.correo().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos."));

        if (Boolean.FALSE.equals(usuario.getCuentaActiva())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Esta cuenta está desactivada.");
        }

        if (usuario.getEmpresa() != null
                && Boolean.FALSE.equals(usuario.getEmpresa().getEstadoEmpresa())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "La empresa asociada a esta cuenta está desactivada.");
        }

        if (!passwordEncoder.matches(request.contrasena(), usuario.getContrasenaHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos.");
        }

        String token = jwtUtil.generateToken(
                usuario.getIdUsuario(),
                usuario.getCorreoUsuario(),
                usuario.getRol().getIdRol()
        );

        return new LoginResponseDTO(
                token,
                usuario.getIdUsuario(),
                usuario.getNombreUsuario(),
                usuario.getCorreoUsuario(),
                usuario.getRol().getIdRol(),
                usuario.getRequiereCambioPassword()
        );
    }

    @PostMapping("/emergencia-reset")
    public ResponseEntity<Map<String, String>> emergenciaReset(@RequestBody EmergenciaResetDTO request) {
        if (request.claveMaestra() == null || !request.claveMaestra().equals(claveEmergencia)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acceso denegado.");
        }

        if (request.nuevaContrasena() == null || request.nuevaContrasena().length() < 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña debe tener al menos 8 caracteres.");
        }

        Usuario usuario = usuarioRepository.findByCorreoUsuario(request.correoUsuario())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));

        usuario.setContrasenaHash(passwordEncoder.encode(request.nuevaContrasena()));
        usuario.setFechaUltimoCambioPassword(LocalDateTime.now());
        usuarioRepository.save(usuario);

        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Contraseña actualizada correctamente.");
        return ResponseEntity.ok(respuesta);
    }
}