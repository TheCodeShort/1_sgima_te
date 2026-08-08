package com.mantenimiento.sigma_te.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rol")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    private Integer idRol;

    @Column(name = "nombre_rol", nullable = false, unique = true, length = 30)
    private String nombreRol;

    @Column(name = "descripcion_rol", length = 150)
    private String descripcionRol;

    @Column(name = "estado_rol", nullable = false)
    @Builder.Default
    private Boolean estadoRol = true;
}
