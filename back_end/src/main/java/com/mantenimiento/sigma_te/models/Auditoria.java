package com.mantenimiento.sigma_te.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity // iniciamos y indicamos que se creara una entidad
@Table(name = "auditoria") // vicula esta clas o entidad con una en la DB que se llama igual
@Getter
@Setter
@NoArgsConstructor // crea el constructor vacio para JPA
@AllArgsConstructor // crear el constructor
@Builder // implementa el patron para crear instancias
public class Auditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_auditoria")
    private Integer idAuditoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_equipo")
    private Equipo equipo;

    @Column(name = "modulo", nullable = false, length = 60)
    private String modulo;

    @Column(name = "accion", nullable = false, length = 60)
    private String accion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "fecha_hora", nullable = false)
    @Builder.Default
    private LocalDateTime fechaHora = LocalDateTime.now();

    @Column(name = "resultado", length = 45)
    private String resultado;
}
