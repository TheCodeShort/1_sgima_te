package com.mantenimiento.sigma_te.repositories;

//en Spring Data JPA, tú solo defines la interfaz y Spring Boot escribe el código por ti en segundo plano

import com.mantenimiento.sigma_te.models.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
// <Rol, => Le dice a Spring: "Este repositorio es exclusivo para gestionar la entidad Rol

/* Integer> => Le indica el tipo de dato que tiene la llave primaria (@Id) dentro de tu clase Rol.
Como tu variable idRol la declaraste como private Integer idRol;, a
quí debes poner obligatoriamente Integer.*/

public interface RolRepository extends JpaRepository<Rol, Integer> {
}
