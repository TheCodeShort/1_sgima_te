package com.mantenimiento.sigma_te.security;

import com.mantenimiento.sigma_te.repositories.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class TenantContext {

    private final UsuarioRepository usuarioRepository;

    public TenantContext(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Integer obtenerIdEmpresaActual(Authentication authentication) {
        Authentication auth = authentication != null
                ? authentication
                : SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getName() == null) {
            return null;
        }

        return usuarioRepository.findByCorreoUsuario(auth.getName())
                .map(usuario -> usuario.getEmpresa() != null ? usuario.getEmpresa().getIdEmpresa() : null)
                .orElse(null);
    }

    public Integer obtenerIdEmpresaActual() {
        return obtenerIdEmpresaActual(SecurityContextHolder.getContext().getAuthentication());
    }

    public boolean coincideEmpresa(Integer idEmpresaDelRegistro, Integer idEmpresaDelUsuario) {
        return Objects.equals(idEmpresaDelRegistro, idEmpresaDelUsuario);
    }
}
