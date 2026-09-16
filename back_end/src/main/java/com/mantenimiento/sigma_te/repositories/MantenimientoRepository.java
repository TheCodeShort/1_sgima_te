package com.mantenimiento.sigma_te.repositories;

import com.mantenimiento.sigma_te.models.Mantenimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MantenimientoRepository extends JpaRepository<Mantenimiento, Integer> {

    List<Mantenimiento> findByEmpresaIsNull();

    List<Mantenimiento> findByEmpresa_IdEmpresa(Integer idEmpresa);
}