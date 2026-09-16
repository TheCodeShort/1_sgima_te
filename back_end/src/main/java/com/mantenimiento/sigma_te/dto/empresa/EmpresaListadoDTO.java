package com.mantenimiento.sigma_te.dto.empresa;

import java.time.LocalDateTime;

public record EmpresaListadoDTO(
    Integer idEmpresa,
    String nombreEmpresa,
    Boolean estadoEmpresa,
    LocalDateTime fechaCreacion
) {}
