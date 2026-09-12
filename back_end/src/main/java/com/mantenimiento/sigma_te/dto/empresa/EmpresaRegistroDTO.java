package com.mantenimiento.sigma_te.dto.empresa;

import java.util.List;

public record EmpresaRegistroDTO(
    String nombreEmpresa,
    String nombreUsuario,
    String correoUsuario,
    String contrasenaHash,
    List<Object> permisos,
    List<Integer> permisosIds,
    List<String> permisosNombres
) {
}
