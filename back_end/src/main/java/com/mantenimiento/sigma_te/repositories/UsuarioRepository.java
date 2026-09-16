package com.mantenimiento.sigma_te.repositories;

import com.mantenimiento.sigma_te.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByCorreoUsuario(String correoUsuario);
    boolean existsByCorreoUsuario(String correoUsuario);
    List<Usuario> findByEmpresa_IdEmpresa(Integer idEmpresa);
}