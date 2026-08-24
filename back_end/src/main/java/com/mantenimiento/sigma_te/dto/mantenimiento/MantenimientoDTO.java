package com.mantenimiento.sigma_te.dto.mantenimiento;

import java.time.LocalDateTime;

public record MantenimientoDTO(
    Integer idMantenimiento,
    Integer idEquipo,
    LocalDateTime fechaRegistro,
    LocalDateTime fechaEjecucion,
    LocalDateTime fechaValidacion,
    String tipo,
    String descripcion,
    String estado,
    Integer idUsuarioRegistra,
    Integer idUsuarioResponsable,
    Integer idUsuarioValidador,
    String observaciones,
    String obsValidacion
) {
}
