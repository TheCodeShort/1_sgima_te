package com.mantenimiento.sigma_te.dto.hojavidaequipo;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

public record EquipoHojaVidaDTO(
    // Campos de equipo
    Integer idEquipo,
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
    LocalDateTime fechaRegistroEquipo,
    Integer idEmpresa,
    String nombreEmpresa,
    Boolean activo,

    // Campos de hoja_vida_equipo (pueden ser null si no existe la hoja de vida)
    String area,
    String responsable,
    LocalDate fechaPuestaServicio,
    Map<String, Object> caracteristicasTecnicas,
    Map<String, Object> documentos,
    String observaciones,
    LocalDateTime fechaCreacionHojaVida,
    LocalDateTime fechaActualizacionHojaVida
) {
}