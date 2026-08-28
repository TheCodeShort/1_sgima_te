package com.mantenimiento.sigma_te.controllers;

import com.mantenimiento.sigma_te.dto.auth.LoginRequestDTO;
import com.mantenimiento.sigma_te.dto.auth.LoginResponseDTO;
import com.mantenimiento.sigma_te.models.Usuario;
import com.mantenimiento.sigma_te.repositories.UsuarioRepository;
import com.mantenimiento.sigma_te.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

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
}
