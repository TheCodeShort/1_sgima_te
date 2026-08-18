package com.mantenimiento.sigma_te.dtos;

public record RolDTO(
    Integer idRol,
    String nombreRol,
    String descripcionRol,
    Boolean estadoRol
) {
}
