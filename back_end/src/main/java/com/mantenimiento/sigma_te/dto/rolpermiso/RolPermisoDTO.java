package com.mantenimiento.sigma_te.dto.rolpermiso;

import java.time.LocalDateTime;

public record RolPermisoDTO(
    Integer idRol,
    Integer idPermiso,
    LocalDateTime fechaAsignacion
) {
}
