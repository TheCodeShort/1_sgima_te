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

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "evidencia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evidencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evidencia")
    private Integer idEvidencia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empresa", nullable = true)
    private Empresa empresa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_equipo", nullable = false)
    private Equipo equipo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_falla", nullable = true)
    private Falla falla;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_mantenimiento", nullable = true)
    private Mantenimiento mantenimiento;

    @Column(name = "tipo_archivo", nullable = false, length = 10)
    private String tipoArchivo;

    @Column(name = "nombre_archivo", nullable = false, length = 150)
    private String nombreArchivo;

    @Column(name = "ruta_archivo", nullable = false, length = 255)
    private String rutaArchivo;

    @Column(name = "tamano_mb", precision = 6, scale = 2)
    private BigDecimal tamanoMb;

    @Column(name = "fecha_carga", nullable = false)
    @Builder.Default
    private LocalDateTime fechaCarga = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_carga", nullable = false)
    private Usuario usuarioCarga;

    @Column(name = "sincronizado", nullable = false)
    @Builder.Default
    private Boolean sincronizado = false;
}
