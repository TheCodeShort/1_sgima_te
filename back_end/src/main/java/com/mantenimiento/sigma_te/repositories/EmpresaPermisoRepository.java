package com.mantenimiento.sigma_te.repositories;

import com.mantenimiento.sigma_te.models.EmpresaPermiso;
import com.mantenimiento.sigma_te.models.EmpresaPermisoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmpresaPermisoRepository extends JpaRepository<EmpresaPermiso, EmpresaPermisoId> {

    List<EmpresaPermiso> findById_IdEmpresa(Integer idEmpresa);

    void deleteById_IdEmpresa(Integer idEmpresa);

    @Query("SELECT p.nombrePermiso FROM EmpresaPermiso ep JOIN Permiso p ON p.idPermiso = ep.id.idPermiso WHERE ep.id.idEmpresa = :idEmpresa")
    List<String> findNombresPermisoByIdEmpresa(@Param("idEmpresa") Integer idEmpresa);
}
