package com.mantenimiento.sigma_te.dto.empresa;

import java.time.LocalDateTime;
import java.util.List;

public record EmpresaResponseDTO(
    Integer idEmpresa,
    String nombreEmpresa,
    Boolean estadoEmpresa,
    LocalDateTime fechaCreacion,
    Integer idUsuarioAdmin,
    String nombreUsuarioAdmin,
    String correoUsuarioAdmin,
    Integer idRolAdmin,
    String nombreRolAdmin,
    List<String> permisosHabilitados
) {
}
