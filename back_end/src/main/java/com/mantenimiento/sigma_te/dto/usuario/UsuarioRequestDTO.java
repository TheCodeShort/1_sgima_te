package com.mantenimiento.sigma_te.dto.usuario;

public record UsuarioRequestDTO(
    String nombreUsuario,
    String correoUsuario,
    Integer idRol,
    String contrasenaHash
) {
}
