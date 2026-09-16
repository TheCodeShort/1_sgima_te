package com.mantenimiento.sigma_te.repositories;

import com.mantenimiento.sigma_te.models.Auditoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditoriaRepository extends JpaRepository<Auditoria, Integer> {

    List<Auditoria> findByEmpresaIsNull();

    List<Auditoria> findByEmpresa_IdEmpresa(Integer idEmpresa);
}