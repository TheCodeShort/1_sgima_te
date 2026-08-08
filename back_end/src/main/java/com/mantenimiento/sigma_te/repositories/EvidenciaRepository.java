package com.mantenimiento.sigma_te.repositories;

import com.mantenimiento.sigma_te.models.Evidencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EvidenciaRepository extends JpaRepository<Evidencia, Integer> {
}
