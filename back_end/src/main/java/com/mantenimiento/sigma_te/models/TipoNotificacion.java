package com.mantenimiento.sigma_te.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tipo_notificacion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TipoNotificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_notificacion")
    private Integer idTipoNotificacion;

    @Column(name = "nombre_tipo", nullable = false, unique = true, length = 30)
    private String nombreTipo;

    @Column(name = "activo", nullable = false)
    @Builder.Default
    private Boolean activo = true;
}
