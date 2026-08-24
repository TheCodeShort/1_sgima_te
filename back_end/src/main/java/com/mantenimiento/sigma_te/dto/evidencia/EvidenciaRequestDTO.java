package com.mantenimiento.sigma_te.dto.evidencia;

import java.math.BigDecimal;

public record EvidenciaRequestDTO(
    Integer idEquipo,
    Integer idFalla,
    Integer idMantenimiento,
    String tipoArchivo,
    String nombreArchivo,
    String rutaArchivo,
    BigDecimal tamanoMb,
    Integer idUsuarioCarga,
    Boolean sincronizado
) {
}
