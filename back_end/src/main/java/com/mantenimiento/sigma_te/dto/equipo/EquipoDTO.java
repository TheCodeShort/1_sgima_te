package com.mantenimiento.sigma_te.dto.equipo;

import java.time.LocalDateTime;

public record EquipoDTO(
    Integer idEquipo,
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
    Integer idUsuarioRegistro,
    LocalDateTime fechaRegistroEquipo,
    Integer idEmpresa,
    String nombreEmpresa
) {
}
