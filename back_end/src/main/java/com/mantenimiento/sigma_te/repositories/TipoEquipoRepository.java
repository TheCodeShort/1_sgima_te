package com.mantenimiento.sigma_te.repositories;

import com.mantenimiento.sigma_te.models.TipoEquipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TipoEquipoRepository extends JpaRepository<TipoEquipo, Integer> {
    List<TipoEquipo> findByActivoTrueOrderByIdTipoEquipoAsc();
}