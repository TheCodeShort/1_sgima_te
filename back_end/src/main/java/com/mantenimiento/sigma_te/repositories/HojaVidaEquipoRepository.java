package com.mantenimiento.sigma_te.repositories;

import com.mantenimiento.sigma_te.models.HojaVidaEquipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HojaVidaEquipoRepository extends JpaRepository<HojaVidaEquipo, Integer> {

    // Buscar por id_equipo (PK/FK a la tabla equipo)
    Optional<HojaVidaEquipo> findByIdEquipo(Integer idEquipo);
}