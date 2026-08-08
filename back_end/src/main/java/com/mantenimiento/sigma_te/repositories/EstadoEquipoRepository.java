package com.mantenimiento.sigma_te.repositories;

import com.mantenimiento.sigma_te.models.EstadoEquipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstadoEquipoRepository extends JpaRepository<EstadoEquipo, Integer> {
}
