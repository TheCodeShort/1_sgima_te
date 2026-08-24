package com.mantenimiento.sigma_te.dto.estadoequipo;

public record EstadoEquipoDTO(
		Integer idEstadoEquipo,
		String nombreEstado,
		String descripcionEstado,
		Boolean permiteOperacion
) {
}
