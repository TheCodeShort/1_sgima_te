package com.mantenimiento.sigma_te.repositories;

import com.mantenimiento.sigma_te.models.Falla;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FallaRepository extends JpaRepository<Falla, Integer> {

    List<Falla> findByEmpresaIsNull();

    List<Falla> findByEmpresa_IdEmpresa(Integer idEmpresa);
}
