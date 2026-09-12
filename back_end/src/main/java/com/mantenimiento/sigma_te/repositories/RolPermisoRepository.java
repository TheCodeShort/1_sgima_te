package com.mantenimiento.sigma_te.repositories;

import com.mantenimiento.sigma_te.models.RolPermiso;
import com.mantenimiento.sigma_te.models.RolPermisoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolPermisoRepository extends JpaRepository<RolPermiso, RolPermisoId> {

    @Query("SELECT p.nombrePermiso FROM RolPermiso rp JOIN Permiso p ON p.idPermiso = rp.id.idPermiso WHERE rp.id.idRol = :idRol")
    List<String> findNombresPermisoByIdRol(@Param("idRol") Integer idRol);
}
