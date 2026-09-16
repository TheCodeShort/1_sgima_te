package com.mantenimiento.sigma_te.services;

import com.mantenimiento.sigma_te.dto.mantenimiento.MantenimientoDTO;
import com.mantenimiento.sigma_te.dto.mantenimiento.MantenimientoRequestDTO;
import com.mantenimiento.sigma_te.models.Empresa;
import com.mantenimiento.sigma_te.models.Equipo;
import com.mantenimiento.sigma_te.models.Mantenimiento;
import com.mantenimiento.sigma_te.models.Usuario;
import com.mantenimiento.sigma_te.repositories.EmpresaRepository;
import com.mantenimiento.sigma_te.repositories.EquipoRepository;
import com.mantenimiento.sigma_te.repositories.MantenimientoRepository;
import com.mantenimiento.sigma_te.repositories.UsuarioRepository;
import com.mantenimiento.sigma_te.security.TenantContext;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MantenimientoService {

    private final MantenimientoRepository mantenimientoRepository;
    private final EquipoRepository equipoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmpresaRepository empresaRepository;
    private final TenantContext tenantContext;

    public MantenimientoService(MantenimientoRepository mantenimientoRepository,
                                 EquipoRepository equipoRepository,
                                 UsuarioRepository usuarioRepository,
                                 EmpresaRepository empresaRepository,
                                 TenantContext tenantContext) {
        this.mantenimientoRepository = mantenimientoRepository;
        this.equipoRepository = equipoRepository;
        this.usuarioRepository = usuarioRepository;
        this.empresaRepository = empresaRepository;
        this.tenantContext = tenantContext;
    }

    public List<MantenimientoDTO> listarTodos(Authentication authentication) {
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        List<Mantenimiento> mantenimientos = idEmpresaActual == null
                ? mantenimientoRepository.findByEmpresaIsNull()
                : mantenimientoRepository.findByEmpresa_IdEmpresa(idEmpresaActual);

        return mantenimientos.stream()
                .map(this::convertirADto)
                .toList();
    }

    public MantenimientoDTO buscarPorId(Integer id, Authentication authentication) {
        Mantenimiento mantenimiento = mantenimientoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Mantenimiento no encontrado."));

        Integer idEmpresaMantenimiento = mantenimiento.getEmpresa() != null ? mantenimiento.getEmpresa().getIdEmpresa() : null;
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        if (!tenantContext.coincideEmpresa(idEmpresaMantenimiento, idEmpresaActual)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Mantenimiento no encontrado.");
        }

        return convertirADto(mantenimiento);
    }

    public MantenimientoDTO crear(MantenimientoRequestDTO request, Authentication authentication) {
        Equipo equipo = equipoRepository.findById(request.idEquipo())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Equipo no encontrado con ID: " + request.idEquipo()));

        Usuario usuarioResponsable = usuarioRepository.findById(request.idUsuarioResponsable())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario responsable no encontrado con ID: " + request.idUsuarioResponsable()));

        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);
        Integer idEmpresaUsuarioResponsable = usuarioResponsable.getEmpresa() != null ? usuarioResponsable.getEmpresa().getIdEmpresa() : null;
        if (!tenantContext.coincideEmpresa(idEmpresaUsuarioResponsable, idEmpresaActual)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario responsable no encontrado.");
        }

        Usuario usuarioRegistra = null;
        if (request.idUsuarioRegistra() != null) {
            usuarioRegistra = usuarioRepository.findById(request.idUsuarioRegistra())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Usuario que registra no encontrado con ID: " + request.idUsuarioRegistra()));

            Integer idEmpresaUsuarioRegistra = usuarioRegistra.getEmpresa() != null ? usuarioRegistra.getEmpresa().getIdEmpresa() : null;
            if (!tenantContext.coincideEmpresa(idEmpresaUsuarioRegistra, idEmpresaActual)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario que registra no encontrado.");
            }
        }

        Usuario usuarioValidador = null;
        if (request.idUsuarioValidador() != null) {
            usuarioValidador = usuarioRepository.findById(request.idUsuarioValidador())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Usuario validador no encontrado con ID: " + request.idUsuarioValidador()));

            Integer idEmpresaUsuarioValidador = usuarioValidador.getEmpresa() != null ? usuarioValidador.getEmpresa().getIdEmpresa() : null;
            if (!tenantContext.coincideEmpresa(idEmpresaUsuarioValidador, idEmpresaActual)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario validador no encontrado.");
            }
        }

        Empresa empresa = null;
        if (idEmpresaActual != null) {
            empresa = empresaRepository.findById(idEmpresaActual)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Empresa no encontrada con ID: " + idEmpresaActual));
        }

        Mantenimiento mantenimiento = Mantenimiento.builder()
                .empresa(empresa)
                .equipo(equipo)
                .fechaRegistro(LocalDateTime.now())
                .fechaEjecucion(request.fechaEjecucion())
                .fechaValidacion(request.fechaValidacion())
                .tipo(request.tipo())
                .descripcion(request.descripcion())
                .estado(request.estado() != null ? request.estado() : "En revision")
                .usuarioRegistra(usuarioRegistra)
                .usuarioResponsable(usuarioResponsable)
                .usuarioValidador(usuarioValidador)
                .observaciones(request.observaciones())
                .obsValidacion(request.obsValidacion())
                .build();

        Mantenimiento guardado = mantenimientoRepository.save(mantenimiento);
        return convertirADto(guardado);
    }

    public MantenimientoDTO actualizar(Integer id, MantenimientoRequestDTO request, Authentication authentication) {
        Mantenimiento mantenimiento = mantenimientoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Mantenimiento no encontrado."));

        Integer idEmpresaMantenimiento = mantenimiento.getEmpresa() != null ? mantenimiento.getEmpresa().getIdEmpresa() : null;
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        if (!tenantContext.coincideEmpresa(idEmpresaMantenimiento, idEmpresaActual)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Mantenimiento no encontrado.");
        }

        Equipo equipo = equipoRepository.findById(request.idEquipo())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Equipo no encontrado con ID: " + request.idEquipo()));

        Usuario usuarioResponsable = usuarioRepository.findById(request.idUsuarioResponsable())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario responsable no encontrado con ID: " + request.idUsuarioResponsable()));

        Integer idEmpresaUsuarioResponsable = usuarioResponsable.getEmpresa() != null ? usuarioResponsable.getEmpresa().getIdEmpresa() : null;
        if (!tenantContext.coincideEmpresa(idEmpresaUsuarioResponsable, idEmpresaActual)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario responsable no encontrado.");
        }

        Usuario usuarioRegistra = null;
        if (request.idUsuarioRegistra() != null) {
            usuarioRegistra = usuarioRepository.findById(request.idUsuarioRegistra())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Usuario que registra no encontrado con ID: " + request.idUsuarioRegistra()));

            Integer idEmpresaUsuarioRegistra = usuarioRegistra.getEmpresa() != null ? usuarioRegistra.getEmpresa().getIdEmpresa() : null;
            if (!tenantContext.coincideEmpresa(idEmpresaUsuarioRegistra, idEmpresaActual)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario que registra no encontrado.");
            }
        }

        Usuario usuarioValidador = null;
        if (request.idUsuarioValidador() != null) {
            usuarioValidador = usuarioRepository.findById(request.idUsuarioValidador())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Usuario validador no encontrado con ID: " + request.idUsuarioValidador()));

            Integer idEmpresaUsuarioValidador = usuarioValidador.getEmpresa() != null ? usuarioValidador.getEmpresa().getIdEmpresa() : null;
            if (!tenantContext.coincideEmpresa(idEmpresaUsuarioValidador, idEmpresaActual)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario validador no encontrado.");
            }
        }

        mantenimiento.setEquipo(equipo);
        mantenimiento.setFechaEjecucion(request.fechaEjecucion());
        mantenimiento.setFechaValidacion(request.fechaValidacion());
        mantenimiento.setTipo(request.tipo());
        mantenimiento.setDescripcion(request.descripcion());
        if (request.estado() != null) {
            mantenimiento.setEstado(request.estado());
        }
        mantenimiento.setUsuarioRegistra(usuarioRegistra);
        mantenimiento.setUsuarioResponsable(usuarioResponsable);
        mantenimiento.setUsuarioValidador(usuarioValidador);
        mantenimiento.setObservaciones(request.observaciones());
        mantenimiento.setObsValidacion(request.obsValidacion());

        Mantenimiento actualizado = mantenimientoRepository.save(mantenimiento);
        return convertirADto(actualizado);
    }

    public void eliminar(Integer id, Authentication authentication) {
        Mantenimiento mantenimiento = mantenimientoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Mantenimiento no encontrado."));

        Integer idEmpresaMantenimiento = mantenimiento.getEmpresa() != null ? mantenimiento.getEmpresa().getIdEmpresa() : null;
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        if (!tenantContext.coincideEmpresa(idEmpresaMantenimiento, idEmpresaActual)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Mantenimiento no encontrado.");
        }

        mantenimientoRepository.delete(mantenimiento);
    }

    private MantenimientoDTO convertirADto(Mantenimiento mantenimiento) {
        return new MantenimientoDTO(
                mantenimiento.getIdMantenimiento(),
                mantenimiento.getEquipo() != null ? mantenimiento.getEquipo().getIdEquipo() : null,
                mantenimiento.getFechaRegistro(),
                mantenimiento.getFechaEjecucion(),
                mantenimiento.getFechaValidacion(),
                mantenimiento.getTipo(),
                mantenimiento.getDescripcion(),
                mantenimiento.getEstado(),
                mantenimiento.getUsuarioRegistra() != null ? mantenimiento.getUsuarioRegistra().getIdUsuario() : null,
                mantenimiento.getUsuarioResponsable() != null ? mantenimiento.getUsuarioResponsable().getIdUsuario() : null,
                mantenimiento.getUsuarioValidador() != null ? mantenimiento.getUsuarioValidador().getIdUsuario() : null,
                mantenimiento.getObservaciones(),
                mantenimiento.getObsValidacion()
        );
    }
}
