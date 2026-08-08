package com.mantenimiento.sigma_te.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "equipo")
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

    @Column(name = "codigo_equipo", nullable = false, unique = true, length = 30)
    private String codigoEquipo;

    @Column(name = "nombre_equipo", nullable = false, length = 120)
    private String nombreEquipo;

    @Column(name = "tipo_equipo", nullable = false, length = 60)
    private String tipoEquipo;

    @Column(name = "marca", length = 80)
    private String marca;

    @Column(name = "modelo", length = 80)
    private String modelo;

    @Column(name = "serial", unique = true, length = 80)
    private String serial;

    @Column(name = "ubicacion", length = 120)
    private String ubicacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_estado_equipo", nullable = false)
    private EstadoEquipo estadoEquipo;

    @Column(name = "frecuencia_calibracion_dias")
    private Integer frecuenciaCalibracionDias;

    @Column(name = "codigo_qr", unique = true, length = 120)
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
