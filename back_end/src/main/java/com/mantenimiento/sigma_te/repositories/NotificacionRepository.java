package com.mantenimiento.sigma_te.repositories;

import com.mantenimiento.sigma_te.models.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Integer> {

    List<Notificacion> findByEmpresaIsNull();

    List<Notificacion> findByEmpresa_IdEmpresa(Integer idEmpresa);
}