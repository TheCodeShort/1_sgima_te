package com.mantenimiento.sigma_te.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "permiso")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permiso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_permiso")
    private Integer idPermiso;

    @Column(name = "nombre_permiso", nullable = false, unique = true, length = 60)
    private String nombrePermiso;

    @Column(name = "modulo", nullable = false, length = 60)
    private String modulo;
}
