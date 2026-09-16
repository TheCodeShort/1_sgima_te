package com.mantenimiento.sigma_te.services;

import com.mantenimiento.sigma_te.dto.falla.FallaDTO;
import com.mantenimiento.sigma_te.dto.falla.FallaRequestDTO;
import com.mantenimiento.sigma_te.models.Empresa;
import com.mantenimiento.sigma_te.models.Equipo;
import com.mantenimiento.sigma_te.models.Falla;
import com.mantenimiento.sigma_te.models.Usuario;
import com.mantenimiento.sigma_te.repositories.EmpresaRepository;
import com.mantenimiento.sigma_te.repositories.EquipoRepository;
import com.mantenimiento.sigma_te.repositories.FallaRepository;
import com.mantenimiento.sigma_te.repositories.UsuarioRepository;
import com.mantenimiento.sigma_te.security.TenantContext;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FallaService {

    private final FallaRepository fallaRepository;
    private final EquipoRepository equipoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmpresaRepository empresaRepository;
    private final TenantContext tenantContext;

    public FallaService(FallaRepository fallaRepository,
                        EquipoRepository equipoRepository,
                        UsuarioRepository usuarioRepository,
                        EmpresaRepository empresaRepository,
                        TenantContext tenantContext) {
        this.fallaRepository = fallaRepository;
        this.equipoRepository = equipoRepository;
        this.usuarioRepository = usuarioRepository;
        this.empresaRepository = empresaRepository;
        this.tenantContext = tenantContext;
    }

    public List<FallaDTO> listarTodos(Authentication authentication) {
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        List<Falla> fallas = idEmpresaActual == null
                ? fallaRepository.findByEmpresaIsNull()
                : fallaRepository.findByEmpresa_IdEmpresa(idEmpresaActual);

        return fallas.stream()
                .map(this::convertirADto)
                .toList();
    }

    public FallaDTO buscarPorId(Integer id, Authentication authentication) {
        Falla falla = fallaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Falla no encontrada."));

        Integer idEmpresaFalla = falla.getEmpresa() != null ? falla.getEmpresa().getIdEmpresa() : null;
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        if (!tenantContext.coincideEmpresa(idEmpresaFalla, idEmpresaActual)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Falla no encontrada.");
        }

        return convertirADto(falla);
    }

    public FallaDTO crear(FallaRequestDTO request, Authentication authentication) {
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        Equipo equipo = equipoRepository.findById(request.idEquipo())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Equipo no encontrado con ID: " + request.idEquipo()));

        Usuario usuarioReporta = usuarioRepository.findById(request.idUsuarioReporta())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario que reporta no encontrado con ID: " + request.idUsuarioReporta()));

        Integer idEmpresaUsuarioReporta = usuarioReporta.getEmpresa() != null ? usuarioReporta.getEmpresa().getIdEmpresa() : null;
        if (!tenantContext.coincideEmpresa(idEmpresaUsuarioReporta, idEmpresaActual)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario que reporta no encontrado.");
        }

        Usuario usuarioRecibe = null;
        if (request.idUsuarioRecibe() != null) {
            usuarioRecibe = usuarioRepository.findById(request.idUsuarioRecibe())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Usuario que recibe no encontrado con ID: " + request.idUsuarioRecibe()));

            Integer idEmpresaUsuarioRecibe = usuarioRecibe.getEmpresa() != null ? usuarioRecibe.getEmpresa().getIdEmpresa() : null;
            if (!tenantContext.coincideEmpresa(idEmpresaUsuarioRecibe, idEmpresaActual)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario que recibe no encontrado.");
            }
        }

        Usuario usuarioAtiende = null;
        if (request.idUsuarioAtiende() != null) {
            usuarioAtiende = usuarioRepository.findById(request.idUsuarioAtiende())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Usuario que atiende no encontrado con ID: " + request.idUsuarioAtiende()));

            Integer idEmpresaUsuarioAtiende = usuarioAtiende.getEmpresa() != null ? usuarioAtiende.getEmpresa().getIdEmpresa() : null;
            if (!tenantContext.coincideEmpresa(idEmpresaUsuarioAtiende, idEmpresaActual)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario que atiende no encontrado.");
            }
        }

        Empresa empresa = null;
        if (idEmpresaActual != null) {
            empresa = empresaRepository.findById(idEmpresaActual)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Empresa no encontrada con ID: " + idEmpresaActual));
        }

        Falla falla = Falla.builder()
                .empresa(empresa)
                .equipo(equipo)
                .fechaReporte(LocalDateTime.now())
                .fechaAtencion(request.fechaAtencion())
                .descripcion(request.descripcion())
                .criticidad(request.criticidad())
                .estado(request.estado() != null ? request.estado() : "Pendiente")
                .usuarioReporta(usuarioReporta)
                .usuarioRecibe(usuarioRecibe)
                .usuarioAtiende(usuarioAtiende)
                .accionRealizada(request.accionRealizada())
                .observaciones(request.observaciones())
                .build();

        Falla guardado = fallaRepository.save(falla);
        return convertirADto(guardado);
    }

    public FallaDTO actualizar(Integer id, FallaRequestDTO request, Authentication authentication) {
        Falla falla = fallaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Falla no encontrada."));

        Integer idEmpresaFalla = falla.getEmpresa() != null ? falla.getEmpresa().getIdEmpresa() : null;
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        if (!tenantContext.coincideEmpresa(idEmpresaFalla, idEmpresaActual)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Falla no encontrada.");
        }

        Equipo equipo = equipoRepository.findById(request.idEquipo())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Equipo no encontrado con ID: " + request.idEquipo()));

        Usuario usuarioReporta = usuarioRepository.findById(request.idUsuarioReporta())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario que reporta no encontrado con ID: " + request.idUsuarioReporta()));

        Integer idEmpresaUsuarioReporta = usuarioReporta.getEmpresa() != null ? usuarioReporta.getEmpresa().getIdEmpresa() : null;
        if (!tenantContext.coincideEmpresa(idEmpresaUsuarioReporta, idEmpresaActual)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario que reporta no encontrado.");
        }

        Usuario usuarioRecibe = null;
        if (request.idUsuarioRecibe() != null) {
            usuarioRecibe = usuarioRepository.findById(request.idUsuarioRecibe())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Usuario que recibe no encontrado con ID: " + request.idUsuarioRecibe()));

            Integer idEmpresaUsuarioRecibe = usuarioRecibe.getEmpresa() != null ? usuarioRecibe.getEmpresa().getIdEmpresa() : null;
            if (!tenantContext.coincideEmpresa(idEmpresaUsuarioRecibe, idEmpresaActual)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario que recibe no encontrado.");
            }
        }

        Usuario usuarioAtiende = null;
        if (request.idUsuarioAtiende() != null) {
            usuarioAtiende = usuarioRepository.findById(request.idUsuarioAtiende())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Usuario que atiende no encontrado con ID: " + request.idUsuarioAtiende()));

            Integer idEmpresaUsuarioAtiende = usuarioAtiende.getEmpresa() != null ? usuarioAtiende.getEmpresa().getIdEmpresa() : null;
            if (!tenantContext.coincideEmpresa(idEmpresaUsuarioAtiende, idEmpresaActual)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario que atiende no encontrado.");
            }
        }

        falla.setEquipo(equipo);
        falla.setFechaAtencion(request.fechaAtencion());
        falla.setDescripcion(request.descripcion());
        falla.setCriticidad(request.criticidad());
        if (request.estado() != null) {
            falla.setEstado(request.estado());
        }
        falla.setUsuarioReporta(usuarioReporta);
        falla.setUsuarioRecibe(usuarioRecibe);
        falla.setUsuarioAtiende(usuarioAtiende);
        falla.setAccionRealizada(request.accionRealizada());
        falla.setObservaciones(request.observaciones());

        Falla actualizado = fallaRepository.save(falla);
        return convertirADto(actualizado);
    }

    public void eliminar(Integer id, Authentication authentication) {
        Falla falla = fallaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Falla no encontrada."));

        Integer idEmpresaFalla = falla.getEmpresa() != null ? falla.getEmpresa().getIdEmpresa() : null;
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        if (!tenantContext.coincideEmpresa(idEmpresaFalla, idEmpresaActual)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Falla no encontrada.");
        }

        fallaRepository.delete(falla);
    }

    private FallaDTO convertirADto(Falla falla) {
        return new FallaDTO(
                falla.getIdFalla(),
                falla.getEquipo() != null ? falla.getEquipo().getIdEquipo() : null,
                falla.getFechaReporte(),
                falla.getFechaAtencion(),
                falla.getDescripcion(),
                falla.getCriticidad(),
                falla.getEstado(),
                falla.getUsuarioReporta() != null ? falla.getUsuarioReporta().getIdUsuario() : null,
                falla.getUsuarioRecibe() != null ? falla.getUsuarioRecibe().getIdUsuario() : null,
                falla.getUsuarioAtiende() != null ? falla.getUsuarioAtiende().getIdUsuario() : null,
                falla.getAccionRealizada(),
                falla.getObservaciones()
        );
    }
}
