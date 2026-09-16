package com.mantenimiento.sigma_te.repositories;

import com.mantenimiento.sigma_te.models.Evidencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvidenciaRepository extends JpaRepository<Evidencia, Integer> {

    List<Evidencia> findByEmpresaIsNull();

    List<Evidencia> findByEmpresa_IdEmpresa(Integer idEmpresa);
}