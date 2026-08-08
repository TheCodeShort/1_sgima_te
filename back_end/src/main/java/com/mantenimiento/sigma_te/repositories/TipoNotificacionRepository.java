package com.mantenimiento.sigma_te.repositories;

import com.mantenimiento.sigma_te.models.TipoNotificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoNotificacionRepository extends JpaRepository<TipoNotificacion, Integer> {
}
