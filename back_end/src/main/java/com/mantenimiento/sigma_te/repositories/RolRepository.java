package com.mantenimiento.sigma_te.repositories;

import com.mantenimiento.sigma_te.models.Rol;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RolRepository extends JpaRepository<Rol, Integer> {

    @EntityGraph(attributePaths = "empresa")
    List<Rol> findAll();

    List<Rol> findByEmpresaIsNull();

    @EntityGraph(attributePaths = "empresa")
    List<Rol> findByEmpresa_IdEmpresa(Integer idEmpresa);

    Optional<Rol> findByEmpresa_IdEmpresaAndEsProtegidoTrue(Integer idEmpresa);

    Optional<Rol> findByEmpresaIsNullAndEsProtegidoTrue();
}
