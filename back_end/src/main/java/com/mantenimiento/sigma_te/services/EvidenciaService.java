package com.mantenimiento.sigma_te.services;

import com.mantenimiento.sigma_te.dto.evidencia.EvidenciaDTO;
import com.mantenimiento.sigma_te.dto.evidencia.EvidenciaRequestDTO;
import com.mantenimiento.sigma_te.models.Equipo;
import com.mantenimiento.sigma_te.models.Evidencia;
import com.mantenimiento.sigma_te.models.Falla;
import com.mantenimiento.sigma_te.models.Mantenimiento;
import com.mantenimiento.sigma_te.models.Usuario;
import com.mantenimiento.sigma_te.repositories.EquipoRepository;
import com.mantenimiento.sigma_te.repositories.EvidenciaRepository;
import com.mantenimiento.sigma_te.repositories.FallaRepository;
import com.mantenimiento.sigma_te.repositories.MantenimientoRepository;
import com.mantenimiento.sigma_te.repositories.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EvidenciaService {

    private final EvidenciaRepository evidenciaRepository;
    private final EquipoRepository equipoRepository;
    private final FallaRepository fallaRepository;
    private final MantenimientoRepository mantenimientoRepository;
    private final UsuarioRepository usuarioRepository;

    public EvidenciaService(EvidenciaRepository evidenciaRepository,
                            EquipoRepository equipoRepository,
                            FallaRepository fallaRepository,
                            MantenimientoRepository mantenimientoRepository,
                            UsuarioRepository usuarioRepository) {
        this.evidenciaRepository = evidenciaRepository;
        this.equipoRepository = equipoRepository;
        this.fallaRepository = fallaRepository;
        this.mantenimientoRepository = mantenimientoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<EvidenciaDTO> listarTodos() {
        return evidenciaRepository.findAll()
                .stream()
                .map(this::convertirADto)
                .toList();
    }

    public EvidenciaDTO buscarPorId(Integer id) {
        Evidencia evidencia = evidenciaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Evidencia no encontrada con ID: " + id));
        return convertirADto(evidencia);
    }

    public EvidenciaDTO crear(EvidenciaRequestDTO request) {
        Equipo equipo = equipoRepository.findById(request.idEquipo())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Equipo no encontrado con ID: " + request.idEquipo()));

        Usuario usuarioCarga = usuarioRepository.findById(request.idUsuarioCarga())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario de carga no encontrado con ID: " + request.idUsuarioCarga()));

        Falla falla = null;
        if (request.idFalla() != null) {
            falla = fallaRepository.findById(request.idFalla())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Falla no encontrada con ID: " + request.idFalla()));
        }

        Mantenimiento mantenimiento = null;
        if (request.idMantenimiento() != null) {
            mantenimiento = mantenimientoRepository.findById(request.idMantenimiento())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Mantenimiento no encontrado con ID: " + request.idMantenimiento()));
        }

        Evidencia evidencia = Evidencia.builder()
                .equipo(equipo)
                .falla(falla)
                .mantenimiento(mantenimiento)
                .tipoArchivo(request.tipoArchivo())
                .nombreArchivo(request.nombreArchivo())
                .rutaArchivo(request.rutaArchivo())
                .tamanoMb(request.tamanoMb())
                .fechaCarga(LocalDateTime.now())
                .usuarioCarga(usuarioCarga)
                .sincronizado(request.sincronizado() != null ? request.sincronizado() : false)
                .build();

        Evidencia guardada = evidenciaRepository.save(evidencia);
        return convertirADto(guardada);
    }

    public EvidenciaDTO actualizar(Integer id, EvidenciaRequestDTO request) {
        Evidencia evidencia = evidenciaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Evidencia no encontrada con ID: " + id));

        Equipo equipo = equipoRepository.findById(request.idEquipo())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Equipo no encontrado con ID: " + request.idEquipo()));

        Usuario usuarioCarga = usuarioRepository.findById(request.idUsuarioCarga())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario de carga no encontrado con ID: " + request.idUsuarioCarga()));

        Falla falla = null;
        if (request.idFalla() != null) {
            falla = fallaRepository.findById(request.idFalla())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Falla no encontrada con ID: " + request.idFalla()));
        }

        Mantenimiento mantenimiento = null;
        if (request.idMantenimiento() != null) {
            mantenimiento = mantenimientoRepository.findById(request.idMantenimiento())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Mantenimiento no encontrado con ID: " + request.idMantenimiento()));
        }

        evidencia.setEquipo(equipo);
        evidencia.setFalla(falla);
        evidencia.setMantenimiento(mantenimiento);
        evidencia.setTipoArchivo(request.tipoArchivo());
        evidencia.setNombreArchivo(request.nombreArchivo());
        evidencia.setRutaArchivo(request.rutaArchivo());
        evidencia.setTamanoMb(request.tamanoMb());
        evidencia.setUsuarioCarga(usuarioCarga);
        if (request.sincronizado() != null) {
            evidencia.setSincronizado(request.sincronizado());
        }

        Evidencia actualizada = evidenciaRepository.save(evidencia);
        return convertirADto(actualizada);
    }

    public void eliminar(Integer id) {
        if (!evidenciaRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Evidencia no encontrada con ID: " + id);
        }
        evidenciaRepository.deleteById(id);
    }

    private EvidenciaDTO convertirADto(Evidencia evidencia) {
        return new EvidenciaDTO(
                evidencia.getIdEvidencia(),
                evidencia.getEquipo() != null ? evidencia.getEquipo().getIdEquipo() : null,
                evidencia.getFalla() != null ? evidencia.getFalla().getIdFalla() : null,
                evidencia.getMantenimiento() != null ? evidencia.getMantenimiento().getIdMantenimiento() : null,
                evidencia.getTipoArchivo(),
                evidencia.getNombreArchivo(),
                evidencia.getRutaArchivo(),
                evidencia.getTamanoMb(),
                evidencia.getFechaCarga(),
                evidencia.getUsuarioCarga() != null ? evidencia.getUsuarioCarga().getIdUsuario() : null,
                evidencia.getSincronizado()
        );
    }
}
