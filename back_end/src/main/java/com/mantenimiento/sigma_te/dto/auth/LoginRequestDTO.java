package com.mantenimiento.sigma_te.dto.auth;

public record LoginRequestDTO(
    String correo,
    String contrasena
) {}
