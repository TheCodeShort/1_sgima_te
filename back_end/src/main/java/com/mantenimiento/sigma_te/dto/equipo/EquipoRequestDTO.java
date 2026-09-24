package com.mantenimiento.sigma_te.dto.equipo;

import java.math.BigDecimal;

public record EquipoRequestDTO(
    String codigoEquipo,
    String nombreEquipo,
    String tipoEquipo,
    String marca,
    String modelo,
    BigDecimal pesoMaximo,
    String unidadPeso,
    String serial,
    String ubicacion,
    Integer idEstadoEquipo,
    Integer frecuenciaCalibracionDias,
    String codigoQr,
    String observacionesEquipo,
    Integer idUsuarioRegistro,
    Integer idEmpresa
) {
}
