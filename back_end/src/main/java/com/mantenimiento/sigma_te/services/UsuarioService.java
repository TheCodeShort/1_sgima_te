package com.mantenimiento.sigma_te.services;

import com.mantenimiento.sigma_te.dto.usuario.UsuarioDTO;
import com.mantenimiento.sigma_te.dto.usuario.UsuarioRequestDTO;
import com.mantenimiento.sigma_te.models.Rol;
import com.mantenimiento.sigma_te.models.Usuario;
import com.mantenimiento.sigma_te.repositories.RolRepository;
import com.mantenimiento.sigma_te.repositories.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, RolRepository rolRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UsuarioDTO> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::convertirADto)
                .toList();
    }

    public UsuarioDTO buscarPorId(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario no encontrado con ID: " + id));
        return convertirADto(usuario);
    }

    public UsuarioDTO crear(UsuarioRequestDTO request) {
        Rol rol = rolRepository.findById(request.idRol())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Rol no encontrado con ID: " + request.idRol()));

        Usuario usuario = Usuario.builder()
                .nombreUsuario(request.nombreUsuario())
                .correoUsuario(request.correoUsuario())
                .rol(rol)
                .contrasenaHash(passwordEncoder.encode(request.contrasenaHash()))
                .cuentaActiva(true)
                .fechaCreacion(LocalDateTime.now())
                .requiereCambioPassword(false)
                .intentosFallidos(0)
                .build();
        Usuario guardado = usuarioRepository.save(usuario);
        return convertirADto(guardado);
    }

    public UsuarioDTO actualizar(Integer id, UsuarioRequestDTO request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario no encontrado con ID: " + id));
        Rol rol = rolRepository.findById(request.idRol())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Rol no encontrado con ID: " + request.idRol()));

        usuario.setNombreUsuario(request.nombreUsuario());
        usuario.setCorreoUsuario(request.correoUsuario());
        usuario.setRol(rol);
        if (request.contrasenaHash() != null && !request.contrasenaHash().isBlank()) {
            usuario.setContrasenaHash(passwordEncoder.encode(request.contrasenaHash()));
            usuario.setFechaUltimoCambioPassword(LocalDateTime.now());
        }
        Usuario actualizado = usuarioRepository.save(usuario);
        return convertirADto(actualizado);
    }

    public void eliminar(Integer id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Usuario no encontrado con ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    private UsuarioDTO convertirADto(Usuario usuario) {
        return new UsuarioDTO(
                usuario.getIdUsuario(),
                usuario.getNombreUsuario(),
                usuario.getCorreoUsuario(),
                usuario.getRol() != null ? usuario.getRol().getIdRol() : null,
                usuario.getCuentaActiva(),
                usuario.getFechaCreacion(),
                usuario.getFechaUltimoCambioPassword(),
                usuario.getRequiereCambioPassword(),
                usuario.getIntentosFallidos(),
                usuario.getBloqueadoHasta(),
                usuario.getUltimoAcceso()
        );
    }
}
