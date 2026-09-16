package com.mantenimiento.sigma_te.security;

import com.mantenimiento.sigma_te.models.Usuario;
import com.mantenimiento.sigma_te.repositories.UsuarioRepository;
import com.mantenimiento.sigma_te.services.RolPermisoService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("permisoChecker")
public class PermisoChecker {

    private final UsuarioRepository usuarioRepository;
    private final RolPermisoService rolPermisoService;

    public PermisoChecker(UsuarioRepository usuarioRepository,
                          RolPermisoService rolPermisoService) {
        this.usuarioRepository = usuarioRepository;
        this.rolPermisoService = rolPermisoService;
    }

    public boolean tienePermiso(Authentication authentication, String nombrePermiso) {
        if (authentication == null || authentication.getName() == null) {
            return false;
        }
        return usuarioRepository.findByCorreoUsuario(authentication.getName())
                .map(usuario -> rolPermisoService.obtenerPermisosEfectivos(usuario).contains(nombrePermiso))
                .orElse(false);
    }
}
