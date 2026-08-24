package com.mantenimiento.sigma_te.dto.tiponotificacion;

public record TipoNotificacionDTO(
        Integer idTipoNotificacion,
        String nombreTipo,
        Boolean activo) {
}
