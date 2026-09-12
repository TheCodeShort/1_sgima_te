package com.mantenimiento.sigma_te.config;

import com.mantenimiento.sigma_te.models.Permiso;
import com.mantenimiento.sigma_te.models.Rol;
import com.mantenimiento.sigma_te.models.RolPermiso;
import com.mantenimiento.sigma_te.models.RolPermisoId;
import com.mantenimiento.sigma_te.models.Usuario;
import com.mantenimiento.sigma_te.repositories.PermisoRepository;
import com.mantenimiento.sigma_te.repositories.RolPermisoRepository;
import com.mantenimiento.sigma_te.repositories.RolRepository;
import com.mantenimiento.sigma_te.repositories.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RolRepository rolRepository;
    private final PermisoRepository permisoRepository;
    private final RolPermisoRepository rolPermisoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RolRepository rolRepository,
                           PermisoRepository permisoRepository,
                           RolPermisoRepository rolPermisoRepository,
                           UsuarioRepository usuarioRepository,
                           PasswordEncoder passwordEncoder) {
        this.rolRepository = rolRepository;
        this.permisoRepository = permisoRepository;
        this.rolPermisoRepository = rolPermisoRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. Si la tabla rol ya contiene registros, no hacer nada
        if (rolRepository.count() > 0) {
            return;
        }

        // 2. Si la tabla rol está vacía:
        // a. Crear rol Administrador protegido
        // El usuario main y su rol Administrador son globales, sin empresa asociada
        Rol rolAdmin = Rol.builder()
                .empresa(null)
                .nombreRol("Administrador")
                .descripcionRol("Rol con acceso total al sistema")
                .estadoRol(true)
                .esProtegido(true)
                .build();
        rolAdmin = rolRepository.save(rolAdmin);

        if (permisoRepository.count() == 0) {
            String[][] permisosBase = {
                {"ver_equipos", "Equipos"},
                {"registrar_falla", "Fallas"},
                {"registrar_mantenimiento", "Mantenimiento"},
                {"cargar_evidencia", "Evidencia"},
                {"gestionar_usuarios", "Administracion"},
                {"gestionar_roles", "Administracion"},
                {"mi_perfil", "mi-perfil"}
            };

            for (String[] datos : permisosBase) {
                Permiso permiso = Permiso.builder()
                        .nombrePermiso(datos[0])
                        .modulo(datos[1])
                        .build();
                permisoRepository.save(permiso);
            }
        }

        // b. Obtener todos los permisos existentes
        List<Permiso> permisos = permisoRepository.findAll();

        // c. Asignar todos los permisos encontrados al nuevo rol
        if (permisos != null && !permisos.isEmpty()) {
            for (Permiso permiso : permisos) {
                RolPermisoId rolPermisoId = new RolPermisoId(rolAdmin.getIdRol(), permiso.getIdPermiso());
                RolPermiso rolPermiso = RolPermiso.builder()
                        .id(rolPermisoId)
                        .fechaAsignacion(LocalDateTime.now())
                        .build();
                rolPermisoRepository.save(rolPermiso);
            }
        }

        // d. Crear usuario Administrador inicial
        // El usuario main y su rol Administrador son globales, sin empresa asociada
        Usuario admin = Usuario.builder()
                .empresa(null)
                .nombreUsuario("Administrador")
                .correoUsuario("admin@sistema.local")
                .rol(rolAdmin)
                .contrasenaHash(passwordEncoder.encode("Admin12345"))
                .cuentaActiva(true)
                .fechaCreacion(LocalDateTime.now())
                .requiereCambioPassword(true)
                .intentosFallidos(0)
                .build();
        usuarioRepository.save(admin);

        // e. Notificación visible en consola
        System.out.println("=== Sistema inicializado: usuario admin@sistema.local creado con contraseña temporal. Cámbiala de inmediato. ===");
    }
}
