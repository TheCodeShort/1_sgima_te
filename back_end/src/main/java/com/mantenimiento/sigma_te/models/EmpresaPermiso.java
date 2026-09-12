package com.mantenimiento.sigma_te.models;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "empresa_permiso")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmpresaPermiso {

    @EmbeddedId
    private EmpresaPermisoId id;

    @Column(name = "fecha_asignacion", nullable = false)
    @Builder.Default
    private LocalDateTime fechaAsignacion = LocalDateTime.now();
}
