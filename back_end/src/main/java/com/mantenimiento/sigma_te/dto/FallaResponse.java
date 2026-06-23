package com.mantenimiento.sigma_te.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FallaResponse {
    private Long id;
    private String descripcion;
    private String estado;
    private LocalDateTime fechaReporte;
    private Long equipoId;
    private String equipoNombre;
    private String usuarioUsername;
}
