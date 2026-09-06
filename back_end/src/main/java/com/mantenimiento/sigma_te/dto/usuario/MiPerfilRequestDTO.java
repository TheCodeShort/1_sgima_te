package com.mantenimiento.sigma_te.dto.usuario;

public record MiPerfilRequestDTO(
    String contrasenaActual,
    String nuevoCorreo,
    String nuevaContrasena
) {}
