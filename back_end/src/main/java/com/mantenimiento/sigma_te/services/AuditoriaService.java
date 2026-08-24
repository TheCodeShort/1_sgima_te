package com.mantenimiento.sigma_te.services;

import com.mantenimiento.sigma_te.dto.auditoria.AuditoriaDTO;
import com.mantenimiento.sigma_te.dto.auditoria.AuditoriaRequestDTO;
import com.mantenimiento.sigma_te.models.Auditoria;
import com.mantenimiento.sigma_te.models.Equipo;
import com.mantenimiento.sigma_te.models.Usuario;
import com.mantenimiento.sigma_te.repositories.AuditoriaRepository;
import com.mantenimiento.sigma_te.repositories.EquipoRepository;
import com.mantenimiento.sigma_te.repositories.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditoriaService {

    private final AuditoriaRepository auditoriaRepository;
    private final EquipoRepository equipoRepository;
    private final UsuarioRepository usuarioRepository;

    public AuditoriaService(AuditoriaRepository auditoriaRepository,
                            EquipoRepository equipoRepository,
                            UsuarioRepository usuarioRepository) {
        this.auditoriaRepository = auditoriaRepository;
        this.equipoRepository = equipoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<AuditoriaDTO> listarTodos() {
        return auditoriaRepository.findAll()
                .stream()
                .map(this::convertirADto)
                .toList();
    }

    public AuditoriaDTO buscarPorId(Integer id) {
        Auditoria auditoria = auditoriaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Auditoria no encontrada con ID: " + id));
        return convertirADto(auditoria);
    }

    public AuditoriaDTO crear(AuditoriaRequestDTO request) {
        Equipo equipo = null;
        if (request.idEquipo() != null) {
            equipo = equipoRepository.findById(request.idEquipo())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Equipo no encontrado con ID: " + request.idEquipo()));
        }

        Usuario usuario = usuarioRepository.findById(request.idUsuario())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario no encontrado con ID: " + request.idUsuario()));

        Auditoria auditoria = Auditoria.builder()
                .equipo(equipo)
                .modulo(request.modulo())
                .accion(request.accion())
                .usuario(usuario)
                .fechaHora(LocalDateTime.now())
                .resultado(request.resultado())
                .build();

        Auditoria guardada = auditoriaRepository.save(auditoria);
        return convertirADto(guardada);
    }

    public AuditoriaDTO actualizar(Integer id, AuditoriaRequestDTO request) {
        Auditoria auditoria = auditoriaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Auditoria no encontrada con ID: " + id));

        Equipo equipo = null;
        if (request.idEquipo() != null) {
            equipo = equipoRepository.findById(request.idEquipo())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Equipo no encontrado con ID: " + request.idEquipo()));
        }

        Usuario usuario = usuarioRepository.findById(request.idUsuario())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario no encontrado con ID: " + request.idUsuario()));

        auditoria.setEquipo(equipo);
        auditoria.setModulo(request.modulo());
        auditoria.setAccion(request.accion());
        auditoria.setUsuario(usuario);
        auditoria.setResultado(request.resultado());

        Auditoria actualizada = auditoriaRepository.save(auditoria);
        return convertirADto(actualizada);
    }

    public void eliminar(Integer id) {
        if (!auditoriaRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Auditoria no encontrada con ID: " + id);
        }
        auditoriaRepository.deleteById(id);
    }

    private AuditoriaDTO convertirADto(Auditoria auditoria) {
        return new AuditoriaDTO(
                auditoria.getIdAuditoria(),
                auditoria.getEquipo() != null ? auditoria.getEquipo().getIdEquipo() : null,
                auditoria.getModulo(),
                auditoria.getAccion(),
                auditoria.getUsuario() != null ? auditoria.getUsuario().getIdUsuario() : null,
                auditoria.getFechaHora(),
                auditoria.getResultado()
        );
    }
}
