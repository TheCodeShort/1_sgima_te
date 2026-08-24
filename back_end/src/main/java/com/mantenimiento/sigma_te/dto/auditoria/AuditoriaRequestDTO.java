package com.mantenimiento.sigma_te.dto.auditoria;

public record AuditoriaRequestDTO(
    Integer idEquipo,
    String modulo,
    String accion,
    Integer idUsuario,
    String resultado
) {
}
