package com.mantenimiento.sigma_te.dto.estadoequipo;

public record EstadoEquipoRequestDTO(
		String nombreEstado,
		String descripcionEstado,
		Boolean permiteOperacion
) {
}
