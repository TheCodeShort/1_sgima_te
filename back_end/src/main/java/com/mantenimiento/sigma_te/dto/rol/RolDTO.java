package com.mantenimiento.sigma_te.dto.rol;

public record RolDTO(
    Integer idRol,
    String nombreRol,
    String descripcionRol,
    Boolean estadoRol,
    Boolean esProtegido
) {
}
