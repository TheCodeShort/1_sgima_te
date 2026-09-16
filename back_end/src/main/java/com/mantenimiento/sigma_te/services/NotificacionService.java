package com.mantenimiento.sigma_te.services;

import com.mantenimiento.sigma_te.dto.notificacion.NotificacionDTO;
import com.mantenimiento.sigma_te.dto.notificacion.NotificacionRequestDTO;
import com.mantenimiento.sigma_te.models.Empresa;
import com.mantenimiento.sigma_te.models.Equipo;
import com.mantenimiento.sigma_te.models.Notificacion;
import com.mantenimiento.sigma_te.models.TipoNotificacion;
import com.mantenimiento.sigma_te.models.Usuario;
import com.mantenimiento.sigma_te.repositories.EmpresaRepository;
import com.mantenimiento.sigma_te.repositories.EquipoRepository;
import com.mantenimiento.sigma_te.repositories.NotificacionRepository;
import com.mantenimiento.sigma_te.repositories.TipoNotificacionRepository;
import com.mantenimiento.sigma_te.repositories.UsuarioRepository;
import com.mantenimiento.sigma_te.security.TenantContext;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final EquipoRepository equipoRepository;
    private final TipoNotificacionRepository tipoNotificacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmpresaRepository empresaRepository;
    private final TenantContext tenantContext;

    public NotificacionService(NotificacionRepository notificacionRepository,
                                  EquipoRepository equipoRepository,
                                  TipoNotificacionRepository tipoNotificacionRepository,
                                  UsuarioRepository usuarioRepository,
                                  EmpresaRepository empresaRepository,
                                  TenantContext tenantContext) {
        this.notificacionRepository = notificacionRepository;
        this.equipoRepository = equipoRepository;
        this.tipoNotificacionRepository = tipoNotificacionRepository;
        this.usuarioRepository = usuarioRepository;
        this.empresaRepository = empresaRepository;
        this.tenantContext = tenantContext;
    }

    public List<NotificacionDTO> listarTodos(Authentication authentication) {
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        List<Notificacion> notificaciones = idEmpresaActual == null
                ? notificacionRepository.findByEmpresaIsNull()
                : notificacionRepository.findByEmpresa_IdEmpresa(idEmpresaActual);

        return notificaciones.stream()
                .map(this::convertirADto)
                .toList();
    }

    public NotificacionDTO buscarPorId(Integer id, Authentication authentication) {
        Notificacion notificacion = notificacionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Notificacion no encontrada."));

        Integer idEmpresaNotificacion = notificacion.getEmpresa() != null ? notificacion.getEmpresa().getIdEmpresa() : null;
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        if (!tenantContext.coincideEmpresa(idEmpresaNotificacion, idEmpresaActual)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Notificacion no encontrada.");
        }

        return convertirADto(notificacion);
    }

    public NotificacionDTO crear(NotificacionRequestDTO request, Authentication authentication) {
        Equipo equipo = equipoRepository.findById(request.idEquipo())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Equipo no encontrado con ID: " + request.idEquipo()));

        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);
        Integer idEmpresaEquipo = equipo.getEmpresa() != null ? equipo.getEmpresa().getIdEmpresa() : null;
        if (!tenantContext.coincideEmpresa(idEmpresaEquipo, idEmpresaActual)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipo no encontrado.");
        }

        TipoNotificacion tipoNotificacion = tipoNotificacionRepository.findById(request.idTipoNotificacion())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Tipo de notificacion no encontrado con ID: " + request.idTipoNotificacion()));

        Usuario usuarioOrigen = usuarioRepository.findById(request.idUsuarioOrigen())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario origen no encontrado con ID: " + request.idUsuarioOrigen()));

        Integer idEmpresaUsuarioOrigen = usuarioOrigen.getEmpresa() != null ? usuarioOrigen.getEmpresa().getIdEmpresa() : null;
        if (!tenantContext.coincideEmpresa(idEmpresaUsuarioOrigen, idEmpresaActual)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario origen no encontrado.");
        }

        Usuario usuarioDestino = usuarioRepository.findById(request.idUsuarioDestino())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario destino no encontrado con ID: " + request.idUsuarioDestino()));

        Integer idEmpresaUsuarioDestino = usuarioDestino.getEmpresa() != null ? usuarioDestino.getEmpresa().getIdEmpresa() : null;
        if (!tenantContext.coincideEmpresa(idEmpresaUsuarioDestino, idEmpresaActual)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario destino no encontrado.");
        }

        Empresa empresa = null;
        if (idEmpresaActual != null) {
            empresa = empresaRepository.findById(idEmpresaActual)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Empresa no encontrada con ID: " + idEmpresaActual));
        }

        Notificacion notificacion = Notificacion.builder()
                .empresa(empresa)
                .equipo(equipo)
                .tipoNotificacion(tipoNotificacion)
                .mensaje(request.mensaje())
                .usuarioOrigen(usuarioOrigen)
                .usuarioDestino(usuarioDestino)
                .fechaEnvio(LocalDateTime.now())
                .fechaLectura(request.fechaLectura())
                .estadoLeido(request.estadoLeido() != null ? request.estadoLeido() : false)
                .build();

        Notificacion guardada = notificacionRepository.save(notificacion);
        return convertirADto(guardada);
    }

    public NotificacionDTO actualizar(Integer id, NotificacionRequestDTO request, Authentication authentication) {
        Notificacion notificacion = notificacionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Notificacion no encontrada."));

        Integer idEmpresaNotificacion = notificacion.getEmpresa() != null ? notificacion.getEmpresa().getIdEmpresa() : null;
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        if (!tenantContext.coincideEmpresa(idEmpresaNotificacion, idEmpresaActual)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Notificacion no encontrada.");
        }

        Equipo equipo = equipoRepository.findById(request.idEquipo())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Equipo no encontrado con ID: " + request.idEquipo()));

        Integer idEmpresaEquipo = equipo.getEmpresa() != null ? equipo.getEmpresa().getIdEmpresa() : null;
        if (!tenantContext.coincideEmpresa(idEmpresaEquipo, idEmpresaActual)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipo no encontrado.");
        }

        TipoNotificacion tipoNotificacion = tipoNotificacionRepository.findById(request.idTipoNotificacion())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Tipo de notificacion no encontrado con ID: " + request.idTipoNotificacion()));

        Usuario usuarioOrigen = usuarioRepository.findById(request.idUsuarioOrigen())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario origen no encontrado con ID: " + request.idUsuarioOrigen()));

        Integer idEmpresaUsuarioOrigen = usuarioOrigen.getEmpresa() != null ? usuarioOrigen.getEmpresa().getIdEmpresa() : null;
        if (!tenantContext.coincideEmpresa(idEmpresaUsuarioOrigen, idEmpresaActual)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario origen no encontrado.");
        }

        Usuario usuarioDestino = usuarioRepository.findById(request.idUsuarioDestino())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario destino no encontrado con ID: " + request.idUsuarioDestino()));

        Integer idEmpresaUsuarioDestino = usuarioDestino.getEmpresa() != null ? usuarioDestino.getEmpresa().getIdEmpresa() : null;
        if (!tenantContext.coincideEmpresa(idEmpresaUsuarioDestino, idEmpresaActual)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario destino no encontrado.");
        }

        notificacion.setEquipo(equipo);
        notificacion.setTipoNotificacion(tipoNotificacion);
        notificacion.setMensaje(request.mensaje());
        notificacion.setUsuarioOrigen(usuarioOrigen);
        notificacion.setUsuarioDestino(usuarioDestino);
        notificacion.setFechaLectura(request.fechaLectura());
        if (request.estadoLeido() != null) {
            notificacion.setEstadoLeido(request.estadoLeido());
        }

        Notificacion actualizada = notificacionRepository.save(notificacion);
        return convertirADto(actualizada);
    }

    public void eliminar(Integer id, Authentication authentication) {
        Notificacion notificacion = notificacionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Notificacion no encontrada."));

        Integer idEmpresaNotificacion = notificacion.getEmpresa() != null ? notificacion.getEmpresa().getIdEmpresa() : null;
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        if (!tenantContext.coincideEmpresa(idEmpresaNotificacion, idEmpresaActual)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Notificacion no encontrada.");
        }

        notificacionRepository.delete(notificacion);
    }

    private NotificacionDTO convertirADto(Notificacion notificacion) {
        return new NotificacionDTO(
                notificacion.getIdNotificacion(),
                notificacion.getEquipo() != null ? notificacion.getEquipo().getIdEquipo() : null,
                notificacion.getTipoNotificacion() != null ? notificacion.getTipoNotificacion().getIdTipoNotificacion() : null,
                notificacion.getMensaje(),
                notificacion.getUsuarioOrigen() != null ? notificacion.getUsuarioOrigen().getIdUsuario() : null,
                notificacion.getUsuarioDestino() != null ? notificacion.getUsuarioDestino().getIdUsuario() : null,
                notificacion.getFechaEnvio(),
                notificacion.getFechaLectura(),
                notificacion.getEstadoLeido()
        );
    }
}