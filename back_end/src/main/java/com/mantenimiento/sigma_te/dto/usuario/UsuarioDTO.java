package com.mantenimiento.sigma_te.dto.usuario;

import java.time.LocalDateTime;

public record UsuarioDTO(
    Integer idUsuario,
    String nombreUsuario,
    String correoUsuario,
    Integer idRol,
    Boolean cuentaActiva,
    LocalDateTime fechaCreacion,
    LocalDateTime fechaUltimoCambioPassword,
    Boolean requiereCambioPassword,
    Integer intentosFallidos,
    LocalDateTime bloqueadoHasta,
    LocalDateTime ultimoAcceso
) {
}
