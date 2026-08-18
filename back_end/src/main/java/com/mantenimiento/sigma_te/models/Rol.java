package com.mantenimiento.sigma_te.models;

import jakarta.persistence.*;
import lombok.*;

// Le dice a Hibernate: "esta clase Java no es una clase cualquiera, representa una tabla de la base de datos — trátala como tal."
@Entity
@Table(name = "rol")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
// lombok
@Builder
public class Rol {
    // Hibernate
    @Id // decimos que este dato es un ID para la DB
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Le dice a Hibernate: "no generes tú el valor de este ID en Java — déjaselo a la base de datos."
    @Column(name = "id_rol") // Nombre de la columna
    private Integer idRol;

    @Column(name = "nombre_rol", nullable = false, unique = true, length = 30)
    private String nombreRol;

    @Column(name = "descripcion_rol", length = 150)
    private String descripcionRol;

    @Column(name = "estado_rol", nullable = false)
    // lombok y para que esta anotacion funcione debe estar @Builder al inicio
    @Builder.Default
    private Boolean estadoRol = true; // lombok
}
