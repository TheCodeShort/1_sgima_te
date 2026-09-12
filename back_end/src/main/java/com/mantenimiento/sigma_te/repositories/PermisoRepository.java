package com.mantenimiento.sigma_te.repositories;

import com.mantenimiento.sigma_te.models.Permiso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PermisoRepository extends JpaRepository<Permiso, Integer> {
    Optional<Permiso> findByNombrePermiso(String nombrePermiso);
}
