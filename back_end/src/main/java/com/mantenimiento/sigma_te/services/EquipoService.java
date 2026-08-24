package com.mantenimiento.sigma_te.services;

import com.mantenimiento.sigma_te.dto.equipo.EquipoDTO;
import com.mantenimiento.sigma_te.dto.equipo.EquipoRequestDTO;
import com.mantenimiento.sigma_te.models.Equipo;
import com.mantenimiento.sigma_te.models.EstadoEquipo;
import com.mantenimiento.sigma_te.models.Usuario;
import com.mantenimiento.sigma_te.repositories.EquipoRepository;
import com.mantenimiento.sigma_te.repositories.EstadoEquipoRepository;
import com.mantenimiento.sigma_te.repositories.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EquipoService {

    private final EquipoRepository equipoRepository;
    private final EstadoEquipoRepository estadoEquipoRepository;
    private final UsuarioRepository usuarioRepository;

    public EquipoService(EquipoRepository equipoRepository,
                         EstadoEquipoRepository estadoEquipoRepository,
                         UsuarioRepository usuarioRepository) {
        this.equipoRepository = equipoRepository;
        this.estadoEquipoRepository = estadoEquipoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<EquipoDTO> listarTodos() {
        return equipoRepository.findAll()
                .stream()
                .map(this::convertirADto)
                .toList();
    }

    public EquipoDTO buscarPorId(Integer id) {
        Equipo equipo = equipoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Equipo no encontrado con ID: " + id));
        return convertirADto(equipo);
    }

    public EquipoDTO crear(EquipoRequestDTO request) {
        EstadoEquipo estadoEquipo = estadoEquipoRepository.findById(request.idEstadoEquipo())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Estado de equipo no encontrado con ID: " + request.idEstadoEquipo()));

        Usuario usuarioRegistro = usuarioRepository.findById(request.idUsuarioRegistro())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario no encontrado con ID: " + request.idUsuarioRegistro()));

        Equipo equipo = Equipo.builder()
                .codigoEquipo(request.codigoEquipo())
                .nombreEquipo(request.nombreEquipo())
                .tipoEquipo(request.tipoEquipo())
                .marca(request.marca())
                .modelo(request.modelo())
                .serial(request.serial())
                .ubicacion(request.ubicacion())
                .estadoEquipo(estadoEquipo)
                .frecuenciaCalibracionDias(request.frecuenciaCalibracionDias())
                .codigoQr(request.codigoQr())
                .observacionesEquipo(request.observacionesEquipo())
                .usuarioRegistro(usuarioRegistro)
                .fechaRegistroEquipo(LocalDateTime.now())
                .build();

        Equipo guardado = equipoRepository.save(equipo);
        return convertirADto(guardado);
    }

    public EquipoDTO actualizar(Integer id, EquipoRequestDTO request) {
        Equipo equipo = equipoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Equipo no encontrado con ID: " + id));

        EstadoEquipo estadoEquipo = estadoEquipoRepository.findById(request.idEstadoEquipo())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Estado de equipo no encontrado con ID: " + request.idEstadoEquipo()));

        Usuario usuarioRegistro = usuarioRepository.findById(request.idUsuarioRegistro())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario no encontrado con ID: " + request.idUsuarioRegistro()));

        equipo.setCodigoEquipo(request.codigoEquipo());
        equipo.setNombreEquipo(request.nombreEquipo());
        equipo.setTipoEquipo(request.tipoEquipo());
        equipo.setMarca(request.marca());
        equipo.setModelo(request.modelo());
        equipo.setSerial(request.serial());
        equipo.setUbicacion(request.ubicacion());
        equipo.setEstadoEquipo(estadoEquipo);
        equipo.setFrecuenciaCalibracionDias(request.frecuenciaCalibracionDias());
        equipo.setCodigoQr(request.codigoQr());
        equipo.setObservacionesEquipo(request.observacionesEquipo());
        equipo.setUsuarioRegistro(usuarioRegistro);

        Equipo actualizado = equipoRepository.save(equipo);
        return convertirADto(actualizado);
    }

    public void eliminar(Integer id) {
        if (!equipoRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Equipo no encontrado con ID: " + id);
        }
        equipoRepository.deleteById(id);
    }

    private EquipoDTO convertirADto(Equipo equipo) {
        return new EquipoDTO(
                equipo.getIdEquipo(),
                equipo.getCodigoEquipo(),
                equipo.getNombreEquipo(),
                equipo.getTipoEquipo(),
                equipo.getMarca(),
                equipo.getModelo(),
                equipo.getSerial(),
                equipo.getUbicacion(),
                equipo.getEstadoEquipo() != null ? equipo.getEstadoEquipo().getIdEstadoEquipo() : null,
                equipo.getFrecuenciaCalibracionDias(),
                equipo.getCodigoQr(),
                equipo.getObservacionesEquipo(),
                equipo.getUsuarioRegistro() != null ? equipo.getUsuarioRegistro().getIdUsuario() : null,
                equipo.getFechaRegistroEquipo()
        );
    }
}
