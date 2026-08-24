package com.mantenimiento.sigma_te.dto.equipo;

public record EquipoRequestDTO(
    String codigoEquipo,
    String nombreEquipo,
    String tipoEquipo,
    String marca,
    String modelo,
    String serial,
    String ubicacion,
    Integer idEstadoEquipo,
    Integer frecuenciaCalibracionDias,
    String codigoQr,
    String observacionesEquipo,
    Integer idUsuarioRegistro
) {
}
