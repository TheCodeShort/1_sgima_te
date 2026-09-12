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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    @JoinColumn(name = "id_empresa", nullable = true)
    private Empresa empresa;

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
