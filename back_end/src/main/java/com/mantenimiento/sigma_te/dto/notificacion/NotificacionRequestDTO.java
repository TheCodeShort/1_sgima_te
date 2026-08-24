package com.mantenimiento.sigma_te.dto.notificacion;

import java.time.LocalDateTime;

public record NotificacionRequestDTO(
    Integer idEquipo,
    Integer idTipoNotificacion,
    String mensaje,
    Integer idUsuarioOrigen,
    Integer idUsuarioDestino,
    LocalDateTime fechaLectura,
    Boolean estadoLeido
) {
}
