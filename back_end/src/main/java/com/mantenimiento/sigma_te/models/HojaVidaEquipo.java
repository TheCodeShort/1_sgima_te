package com.mantenimiento.sigma_te.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "hoja_vida_equipo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HojaVidaEquipo {

    @Id
    @Column(name = "id_equipo")
    private Integer idEquipo;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id_equipo")
    private Equipo equipo;

    @Column(name = "area", length = 120)
    private String area;

    @Column(name = "responsable", length = 120)
    private String responsable;

    @Column(name = "fecha_puesta_servicio")
    private LocalDate fechaPuestaServicio;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "caracteristicas_tecnicas", columnDefinition = "jsonb")
    private Map<String, Object> caracteristicasTecnicas;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "documentos", columnDefinition = "jsonb")
    private Map<String, Object> documentos;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "fecha_creacion", nullable = false)
    @Builder.Default
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Column(name = "fecha_actualizacion", nullable = false)
    @Builder.Default
    private LocalDateTime fechaActualizacion = LocalDateTime.now();
}