package com.mantenimiento.sigma_te.dto.hojavidaequipo;

import java.time.LocalDate;
import java.util.Map;

public record HojaVidaEquipoRequestDTO(
    String area,
    String responsable,
    LocalDate fechaPuestaServicio,
    Map<String, Object> caracteristicasTecnicas,
    Map<String, Object> documentos,
    String observaciones
) {
}