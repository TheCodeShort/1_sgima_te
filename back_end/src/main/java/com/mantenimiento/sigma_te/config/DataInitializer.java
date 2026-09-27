package com.mantenimiento.sigma_te.config;

import com.mantenimiento.sigma_te.models.EstadoEquipo;
import com.mantenimiento.sigma_te.models.Permiso;
import com.mantenimiento.sigma_te.models.Rol;
import com.mantenimiento.sigma_te.models.RolPermiso;
import com.mantenimiento.sigma_te.models.RolPermisoId;
import com.mantenimiento.sigma_te.models.Usuario;
import com.mantenimiento.sigma_te.repositories.EstadoEquipoRepository;
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
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RolRepository rolRepository;
    private final PermisoRepository permisoRepository;
    private final RolPermisoRepository rolPermisoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EstadoEquipoRepository estadoEquipoRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RolRepository rolRepository,
                            PermisoRepository permisoRepository,
                            RolPermisoRepository rolPermisoRepository,
                            UsuarioRepository usuarioRepository,
                            EstadoEquipoRepository estadoEquipoRepository,
                            PasswordEncoder passwordEncoder) {
        this.rolRepository = rolRepository;
        this.permisoRepository = permisoRepository;
        this.rolPermisoRepository = rolPermisoRepository;
        this.usuarioRepository = usuarioRepository;
        this.estadoEquipoRepository = estadoEquipoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        sembrarEstadosEquipoSiFalta();

        if (rolRepository.count() == 0) {
            bootstrapInicial();
        }

        // Se ejecuta SIEMPRE, en cada arranque, sin depender de recrear
        // la base de datos desde cero. Asi se agregan permisos nuevos
        // en el futuro sin repetir este mismo problema.
        sembrarPermisoEditarEquiposSiFalta();
    }

    private void sembrarEstadosEquipoSiFalta() {
        if (estadoEquipoRepository.count() == 0) {
            Object[][] estadosBase = {
                {"Operativo", "Equipo funcionando con normalidad", true},
                {"En mantenimiento", "Equipo en proceso de mantenimiento programado", false},
                {"Fuera de servicio", "Equipo dado de baja o inoperativo", false}
            };

            for (Object[] datos : estadosBase) {
                EstadoEquipo estado = EstadoEquipo.builder()
                        .nombreEstado((String) datos[0])
                        .descripcionEstado((String) datos[1])
                        .permiteOperacion((Boolean) datos[2])
                        .build();
                estadoEquipoRepository.save(estado);
            }
        }
    }

    private void bootstrapInicial() {
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
                {"ver_detalle_equipo", "Equipos"},
                {"editar_equipos", "Equipos"},
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

        List<Permiso> permisos = permisoRepository.findAll();

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

        String correoAdmin = System.getenv().getOrDefault("ADMIN_EMAIL", "admin@sistema.local");
        String passwordAdmin = System.getenv().getOrDefault("ADMIN_PASSWORD", "Admin12345");

        Usuario admin = Usuario.builder()
                .empresa(null)
                .nombreUsuario("Administrador")
                .correoUsuario(correoAdmin)
                .rol(rolAdmin)
                .contrasenaHash(passwordEncoder.encode(passwordAdmin))
                .cuentaActiva(true)
                .fechaCreacion(LocalDateTime.now())
                .requiereCambioPassword(true)
                .intentosFallidos(0)
                .build();
        usuarioRepository.save(admin);

        System.out.println("=== Sistema inicializado: usuario admin@sistema.local creado con contraseña temporal. Cámbiala de inmediato. ===");
    }

    private void sembrarPermisoEditarEquiposSiFalta() {
        Permiso permisoEditarEquipos = permisoRepository.findByNombrePermiso("editar_equipos")
                .orElseGet(() -> {
                    Permiso nuevo = Permiso.builder()
                            .nombrePermiso("editar_equipos")
                            .modulo("Equipos")
                            .build();
                    return permisoRepository.save(nuevo);
                });

        Optional<Rol> rolAdminOpt = rolRepository.findByEmpresaIsNullAndEsProtegidoTrue();

        if (rolAdminOpt.isPresent()) {
            Rol rolAdmin = rolAdminOpt.get();
            RolPermisoId id = new RolPermisoId(rolAdmin.getIdRol(), permisoEditarEquipos.getIdPermiso());

            if (!rolPermisoRepository.existsById(id)) {
                RolPermiso asignacion = RolPermiso.builder()
                        .id(id)
                        .fechaAsignacion(LocalDateTime.now())
                        .build();
                rolPermisoRepository.save(asignacion);
                System.out.println("=== Permiso 'editar_equipos' creado y asignado al rol Administrador. ===");
            }
        }
    }
}