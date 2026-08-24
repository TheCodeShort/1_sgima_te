package com.mantenimiento.sigma_te.services;

import com.mantenimiento.sigma_te.dto.notificacion.NotificacionDTO;
import com.mantenimiento.sigma_te.dto.notificacion.NotificacionRequestDTO;
import com.mantenimiento.sigma_te.models.Equipo;
import com.mantenimiento.sigma_te.models.Notificacion;
import com.mantenimiento.sigma_te.models.TipoNotificacion;
import com.mantenimiento.sigma_te.models.Usuario;
import com.mantenimiento.sigma_te.repositories.EquipoRepository;
import com.mantenimiento.sigma_te.repositories.NotificacionRepository;
import com.mantenimiento.sigma_te.repositories.TipoNotificacionRepository;
import com.mantenimiento.sigma_te.repositories.UsuarioRepository;
import org.springframework.http.HttpStatus;
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

    public NotificacionService(NotificacionRepository notificacionRepository,
                               EquipoRepository equipoRepository,
                               TipoNotificacionRepository tipoNotificacionRepository,
                               UsuarioRepository usuarioRepository) {
        this.notificacionRepository = notificacionRepository;
        this.equipoRepository = equipoRepository;
        this.tipoNotificacionRepository = tipoNotificacionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<NotificacionDTO> listarTodos() {
        return notificacionRepository.findAll()
                .stream()
                .map(this::convertirADto)
                .toList();
    }

    public NotificacionDTO buscarPorId(Integer id) {
        Notificacion notificacion = notificacionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Notificacion no encontrada con ID: " + id));
        return convertirADto(notificacion);
    }

    public NotificacionDTO crear(NotificacionRequestDTO request) {
        Equipo equipo = equipoRepository.findById(request.idEquipo())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Equipo no encontrado con ID: " + request.idEquipo()));

        TipoNotificacion tipoNotificacion = tipoNotificacionRepository.findById(request.idTipoNotificacion())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Tipo de notificacion no encontrado con ID: " + request.idTipoNotificacion()));

        Usuario usuarioOrigen = usuarioRepository.findById(request.idUsuarioOrigen())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario origen no encontrado con ID: " + request.idUsuarioOrigen()));

        Usuario usuarioDestino = usuarioRepository.findById(request.idUsuarioDestino())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario destino no encontrado con ID: " + request.idUsuarioDestino()));

        Notificacion notificacion = Notificacion.builder()
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

    public NotificacionDTO actualizar(Integer id, NotificacionRequestDTO request) {
        Notificacion notificacion = notificacionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Notificacion no encontrada con ID: " + id));

        Equipo equipo = equipoRepository.findById(request.idEquipo())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Equipo no encontrado con ID: " + request.idEquipo()));

        TipoNotificacion tipoNotificacion = tipoNotificacionRepository.findById(request.idTipoNotificacion())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Tipo de notificacion no encontrado con ID: " + request.idTipoNotificacion()));

        Usuario usuarioOrigen = usuarioRepository.findById(request.idUsuarioOrigen())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario origen no encontrado con ID: " + request.idUsuarioOrigen()));

        Usuario usuarioDestino = usuarioRepository.findById(request.idUsuarioDestino())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario destino no encontrado con ID: " + request.idUsuarioDestino()));

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

    public void eliminar(Integer id) {
        if (!notificacionRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Notificacion no encontrada con ID: " + id);
        }
        notificacionRepository.deleteById(id);
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
