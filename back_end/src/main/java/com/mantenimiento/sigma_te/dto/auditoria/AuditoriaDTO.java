package com.mantenimiento.sigma_te.dto.auditoria;

import java.time.LocalDateTime;

public record AuditoriaDTO(
    Integer idAuditoria,
    Integer idEquipo,
    String modulo,
    String accion,
    Integer idUsuario,
    LocalDateTime fechaHora,
    String resultado
) {
}
