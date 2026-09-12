package com.mantenimiento.sigma_te.repositories;

import com.mantenimiento.sigma_te.models.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Integer> {
    boolean existsByNombreEmpresa(String nombreEmpresa);
    Optional<Empresa> findByNombreEmpresa(String nombreEmpresa);
}
