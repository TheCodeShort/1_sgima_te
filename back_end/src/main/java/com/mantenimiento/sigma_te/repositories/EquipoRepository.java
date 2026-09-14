package com.mantenimiento.sigma_te.repositories;

import com.mantenimiento.sigma_te.models.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipoRepository extends JpaRepository<Equipo, Integer> {

    List<Equipo> findByEmpresa_IdEmpresa(Integer idEmpresa);

    List<Equipo> findByEmpresaIsNull();
}
