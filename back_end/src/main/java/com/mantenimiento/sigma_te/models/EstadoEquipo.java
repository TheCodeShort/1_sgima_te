package com.mantenimiento.sigma_te.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "estado_equipo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstadoEquipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estado_equipo")
    private Integer idEstadoEquipo;

    @Column(name = "nombre_estado", nullable = false, unique = true, length = 25)
    private String nombreEstado;

    @Column(name = "descripcion_estado", length = 150)
    private String descripcionEstado;

    @Column(name = "permite_operacion", nullable = false)
    @Builder.Default
    private Boolean permiteOperacion = true;
}
