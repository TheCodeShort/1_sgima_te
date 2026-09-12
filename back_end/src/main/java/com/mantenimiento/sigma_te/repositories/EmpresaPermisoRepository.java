package com.mantenimiento.sigma_te.repositories;

import com.mantenimiento.sigma_te.models.EmpresaPermiso;
import com.mantenimiento.sigma_te.models.EmpresaPermisoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmpresaPermisoRepository extends JpaRepository<EmpresaPermiso, EmpresaPermisoId> {
}
