package com.mantenimiento.sigma_te.repositories;

import com.mantenimiento.sigma_te.models.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolRepository extends JpaRepository<Rol, Integer> {

    List<Rol> findByEmpresaIsNull();

    List<Rol> findByEmpresa_IdEmpresa(Integer idEmpresa);
}