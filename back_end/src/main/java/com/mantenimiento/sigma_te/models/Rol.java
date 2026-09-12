package com.mantenimiento.sigma_te.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Le dice a Hibernate: "esta clase Java no es una clase cualquiera, representa una tabla de la base de datos — trátala como tal."
@Entity
@Table(name = "rol", uniqueConstraints = @UniqueConstraint(columnNames = {"id_empresa", "nombre_rol"}))
@Getter
@Setter
@NoArgsConstructor // Hibernate usa el constructor vacío para crear el objeto en memoria sin ningún dato dentro
@AllArgsConstructor
// lombok
@Builder
public class Rol {
    // Hibernate
    @Id // decimos que este dato es un ID para la DB
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Le dice a Hibernate: "no generes tú el valor de este ID en Java — déjaselo a la base de datos."
    @Column(name = "id_rol") // Nombre de la columna
    private Integer idRol;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empresa", nullable = true)
    private Empresa empresa;

    @Column(name = "nombre_rol", nullable = false, length = 30)
    private String nombreRol;

    @Column(name = "descripcion_rol", length = 150)
    private String descripcionRol;

    @Column(name = "estado_rol", nullable = false)
    // lombok y para que esta anotacion funcione debe estar @Builder al inicio
    @Builder.Default
    private Boolean estadoRol = true; // lombok

    @Column(name = "es_protegido", nullable = false)
    @Builder.Default
    private Boolean esProtegido = false;
}
