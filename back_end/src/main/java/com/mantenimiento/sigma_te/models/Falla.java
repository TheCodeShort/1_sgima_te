package com.mantenimiento.sigma_te.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "fallas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Falla {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String descripcion;

    private String estado;

    private LocalDateTime fechaReporte;

    @ManyToOne
    @JoinColumn(name = "equipo_id")
    private Equipo equipo;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}
