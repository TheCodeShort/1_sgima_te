package com.mantenimiento.sigma_te.dto.evidencia;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record EvidenciaDTO(
    Integer idEvidencia,
    Integer idEquipo,
    Integer idFalla,
    Integer idMantenimiento,
    String tipoArchivo,
    String nombreArchivo,
    String rutaArchivo,
    BigDecimal tamanoMb,
    LocalDateTime fechaCarga,
    Integer idUsuarioCarga,
    Boolean sincronizado
) {
}
