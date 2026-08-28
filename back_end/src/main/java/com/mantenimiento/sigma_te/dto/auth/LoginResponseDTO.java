package com.mantenimiento.sigma_te.dto.auth;

public record LoginResponseDTO(
    String token,
    Integer idUsuario,
    String nombreUsuario,
    String correoUsuario,
    Integer idRol,
    Boolean requiereCambioPassword
) {}
