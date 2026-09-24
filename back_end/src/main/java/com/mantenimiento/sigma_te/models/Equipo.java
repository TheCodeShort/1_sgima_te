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

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "equipo", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"id_empresa", "codigo_equipo"}),
    @UniqueConstraint(columnNames = {"id_empresa", "serial"}),
    @UniqueConstraint(columnNames = {"id_empresa", "codigo_qr"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_equipo")
    private Integer idEquipo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empresa", nullable = true)
    private Empresa empresa;

    @Column(name = "codigo_equipo", nullable = false, length = 30)
    private String codigoEquipo;

    @Column(name = "nombre_equipo", nullable = false, length = 120)
    private String nombreEquipo;

    @Column(name = "tipo_equipo", nullable = false, length = 60)
    private String tipoEquipo;

    @Column(name = "marca", length = 80)
    private String marca;

    @Column(name = "modelo", length = 80)
    private String modelo;

    @Column(name = "peso_maximo", precision = 10, scale = 3)
    private BigDecimal pesoMaximo;

    @Column(name = "unidad_peso", length = 10)
    private String unidadPeso;

    @Column(name = "serial", length = 80)
    private String serial;

    @Column(name = "ubicacion", length = 120)
    private String ubicacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_estado_equipo", nullable = false)
    private EstadoEquipo estadoEquipo;

    @Column(name = "frecuencia_calibracion_dias")
    private Integer frecuenciaCalibracionDias;

    @Column(name = "codigo_qr", length = 120)
    private String codigoQr;

    @Column(name = "observaciones_equipo", columnDefinition = "TEXT")
    private String observacionesEquipo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_registro", nullable = false)
    private Usuario usuarioRegistro;

    @Column(name = "fecha_registro_equipo", nullable = false)
    @Builder.Default
    private LocalDateTime fechaRegistroEquipo = LocalDateTime.now();
}
