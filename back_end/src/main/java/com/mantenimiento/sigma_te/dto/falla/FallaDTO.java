package com.mantenimiento.sigma_te.dto.falla;

import java.time.LocalDateTime;

public record FallaDTO(
    Integer idFalla,
    Integer idEquipo,
    LocalDateTime fechaReporte,
    LocalDateTime fechaAtencion,
    String descripcion,
    String criticidad,
    String estado,
    Integer idUsuarioReporta,
    Integer idUsuarioRecibe,
    Integer idUsuarioAtiende,
    String accionRealizada,
    String observaciones
) {
}
