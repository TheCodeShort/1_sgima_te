package com.mantenimiento.sigma_te.controllers;

import com.mantenimiento.sigma_te.dto.usuario.MiPerfilRequestDTO;
import com.mantenimiento.sigma_te.dto.usuario.UsuarioCambiarEstadoDTO;
import com.mantenimiento.sigma_te.dto.usuario.UsuarioDTO;
import com.mantenimiento.sigma_te.dto.usuario.UsuarioRequestDTO;
import com.mantenimiento.sigma_te.models.Usuario;
import com.mantenimiento.sigma_te.services.RolPermisoService;
import com.mantenimiento.sigma_te.repositories.UsuarioRepository;
import com.mantenimiento.sigma_te.services.UsuarioService;
import com.mantenimiento.sigma_te.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    private final JwtUtil jwtUtil;
    private final RolPermisoService rolPermisoService;

    public UsuarioController(UsuarioService usuarioService,
                              UsuarioRepository usuarioRepository,
                              PasswordEncoder passwordEncoder,
                              JwtUtil jwtUtil,
                              RolPermisoService rolPermisoService) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.rolPermisoService = rolPermisoService;
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'gestionar_usuarios')")
    @GetMapping
    public List<UsuarioDTO> listarTodos(Authentication authentication) {
        return usuarioService.listarTodos(authentication);
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'gestionar_usuarios')")
    @GetMapping("/{id}")
    public UsuarioDTO buscarPorId(@PathVariable Integer id, Authentication authentication) {
        return usuarioService.buscarPorId(id, authentication);
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'gestionar_usuarios')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioDTO crear(@RequestBody UsuarioRequestDTO request, Authentication authentication) {
        return usuarioService.crear(request, authentication);
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'gestionar_usuarios')")
    @PutMapping("/{id}")
    public UsuarioDTO actualizar(@PathVariable Integer id, @RequestBody UsuarioRequestDTO request, Authentication authentication) {
        return usuarioService.actualizar(id, request, authentication);
    }

    @PutMapping("/mi-perfil")
    public ResponseEntity<Map<String, String>> actualizarMiPerfil(
            @RequestBody MiPerfilRequestDTO request,
            org.springframework.security.core.Authentication authentication) {

        String correoActual = authentication.getName();

        Usuario usuario = usuarioRepository.findByCorreoUsuario(correoActual)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));

        if (!rolPermisoService.obtenerPermisosEfectivos(usuario).contains("mi_perfil")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para acceder a esta sección.");
        }

        if (request.contrasenaActual() == null || 
            !passwordEncoder.matches(request.contrasenaActual(), usuario.getContrasenaHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "La contraseña actual es incorrecta.");
        }

        boolean huboCambios = false;
        boolean correoCambio = false;

        if (request.nuevoCorreo() != null && !request.nuevoCorreo().isBlank()
            && !request.nuevoCorreo().equals(usuario.getCorreoUsuario())) {
            if (usuarioRepository.existsByCorreoUsuario(request.nuevoCorreo().trim())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Este correo ya está registrado por otro usuario.");
            }
            usuario.setCorreoUsuario(request.nuevoCorreo().trim());
            huboCambios = true;
            correoCambio = true;
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
        if (correoCambio) {
            String nuevoToken = jwtUtil.generateToken(usuario.getIdUsuario(), usuario.getCorreoUsuario(), usuario.getRol().getIdRol());
            respuesta.put("token", nuevoToken);
        }
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/mi-perfil")
    public UsuarioDTO obtenerMiPerfil(org.springframework.security.core.Authentication authentication) {
        String correoActual = authentication.getName();

        Usuario usuario = usuarioRepository.findByCorreoUsuario(correoActual)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));

        if (!rolPermisoService.obtenerPermisosEfectivos(usuario).contains("mi_perfil")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para acceder a esta sección.");
        }

        return usuarioService.buscarPorId(usuario.getIdUsuario(), authentication);
    }

    @GetMapping("/mi-perfil/permisos")
    public List<String> obtenerMisPermisos(org.springframework.security.core.Authentication authentication) {
        String correoActual = authentication.getName();

        Usuario usuario = usuarioRepository.findByCorreoUsuario(correoActual)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));

        return rolPermisoService.obtenerPermisosEfectivos(usuario);
    }

    @GetMapping("/mi-perfil/rol")
    public Map<String, String> obtenerMiRol(org.springframework.security.core.Authentication authentication) {
        String correoActual = authentication.getName();

        Usuario usuario = usuarioRepository.findByCorreoUsuario(correoActual)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));

        return Map.of("nombreRol", usuario.getRol().getNombreRol());
    }

    @PreAuthorize("@permisoChecker.tienePermiso(authentication, 'gestionar_usuarios')")
    @PatchMapping("/{id}/estado")
    public UsuarioDTO cambiarEstado(
            @PathVariable Integer id,
            @RequestBody UsuarioCambiarEstadoDTO request,
            Authentication authentication) {
        return usuarioService.cambiarEstado(id, request.activo(), authentication);
    }

//    @DeleteMapping("/{id}")
//    @ResponseStatus(HttpStatus.NO_CONTENT)
//    public void eliminar(@PathVariable Integer id) {
//        usuarioService.eliminar(id);
//    }
}