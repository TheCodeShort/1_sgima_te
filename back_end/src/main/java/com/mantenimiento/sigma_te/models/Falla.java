package com.mantenimiento.sigma_te.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "falla")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Falla {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_falla")
    private Integer idFalla;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_equipo", nullable = false)
    private Equipo equipo;

    @Column(name = "fecha_reporte", nullable = false)
    @Builder.Default
    private LocalDateTime fechaReporte = LocalDateTime.now();

    @Column(name = "fecha_atencion")
    private LocalDateTime fechaAtencion;

    @Column(name = "descripcion", nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "criticidad", nullable = false, length = 10)
    private String criticidad;

    @Column(name = "estado", nullable = false, length = 15)
    @Builder.Default
    private String estado = "Pendiente";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_reporta", nullable = false)
    private Usuario usuarioReporta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_recibe")
    private Usuario usuarioRecibe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_atiende")
    private Usuario usuarioAtiende;

    @Column(name = "accion_realizada", columnDefinition = "TEXT")
    private String accionRealizada;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;
}
