package com.mantenimiento.sigma_te.dto.auth;

public record EmergenciaResetDTO(
    String claveMaestra,
    String correoUsuario,
    String nuevaContrasena
) {}
