package com.mantenimiento.sigma_te.repositories;

import com.mantenimiento.sigma_te.models.Falla;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FallaRepository extends JpaRepository<Falla, Integer> {
}
