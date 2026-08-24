package com.mantenimiento.sigma_te.dto.notificacion;

import java.time.LocalDateTime;

public record NotificacionDTO(
    Integer idNotificacion,
    Integer idEquipo,
    Integer idTipoNotificacion,
    String mensaje,
    Integer idUsuarioOrigen,
    Integer idUsuarioDestino,
    LocalDateTime fechaEnvio,
    LocalDateTime fechaLectura,
    Boolean estadoLeido
) {
}
