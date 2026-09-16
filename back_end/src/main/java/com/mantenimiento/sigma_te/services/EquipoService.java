package com.mantenimiento.sigma_te.services;

import com.mantenimiento.sigma_te.dto.equipo.EquipoDTO;
import com.mantenimiento.sigma_te.dto.equipo.EquipoRequestDTO;
import com.mantenimiento.sigma_te.models.Empresa;
import com.mantenimiento.sigma_te.models.Equipo;
import com.mantenimiento.sigma_te.models.EstadoEquipo;
import com.mantenimiento.sigma_te.models.Usuario;
import com.mantenimiento.sigma_te.repositories.EmpresaRepository;
import com.mantenimiento.sigma_te.repositories.EquipoRepository;
import com.mantenimiento.sigma_te.repositories.EstadoEquipoRepository;
import com.mantenimiento.sigma_te.repositories.UsuarioRepository;
import com.mantenimiento.sigma_te.security.TenantContext;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EquipoService {

    private final EquipoRepository equipoRepository;
    private final EstadoEquipoRepository estadoEquipoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmpresaRepository empresaRepository;
    private final TenantContext tenantContext;

    public EquipoService(EquipoRepository equipoRepository,
                         EstadoEquipoRepository estadoEquipoRepository,
                         UsuarioRepository usuarioRepository,
                         EmpresaRepository empresaRepository,
                         TenantContext tenantContext) {
        this.equipoRepository = equipoRepository;
        this.estadoEquipoRepository = estadoEquipoRepository;
        this.usuarioRepository = usuarioRepository;
        this.empresaRepository = empresaRepository;
        this.tenantContext = tenantContext;
    }

    public List<EquipoDTO> listarTodos(Authentication authentication) {
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        List<Equipo> equipos = idEmpresaActual == null
                ? equipoRepository.findByEmpresaIsNull()
                : equipoRepository.findByEmpresa_IdEmpresa(idEmpresaActual);

        return equipos.stream()
                .map(this::convertirADto)
                .toList();
    }

    public EquipoDTO buscarPorId(Integer id, Authentication authentication) {
        Equipo equipo = equipoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Equipo no encontrado."));

        Integer idEmpresaEquipo = equipo.getEmpresa() != null ? equipo.getEmpresa().getIdEmpresa() : null;
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        if (!tenantContext.coincideEmpresa(idEmpresaEquipo, idEmpresaActual)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Equipo no encontrado.");
        }

        return convertirADto(equipo);
    }

    public EquipoDTO crear(EquipoRequestDTO request, Authentication authentication) {
        EstadoEquipo estadoEquipo = estadoEquipoRepository.findById(request.idEstadoEquipo())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Estado de equipo no encontrado con ID: " + request.idEstadoEquipo()));

        Usuario usuarioRegistro = usuarioRepository.findById(request.idUsuarioRegistro())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario no encontrado con ID: " + request.idUsuarioRegistro()));

        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);
        Integer idEmpresaDelUsuarioRegistro = usuarioRegistro.getEmpresa() != null ? usuarioRegistro.getEmpresa().getIdEmpresa() : null;
        if (!tenantContext.coincideEmpresa(idEmpresaDelUsuarioRegistro, idEmpresaActual)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario de registro no encontrado.");
        }

        Empresa empresa = null;
        if (idEmpresaActual != null) {
            empresa = empresaRepository.findById(idEmpresaActual)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Empresa no encontrada con ID: " + idEmpresaActual));
        }

        Equipo equipo = Equipo.builder()
                .empresa(empresa)
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

    public EquipoDTO actualizar(Integer id, EquipoRequestDTO request, Authentication authentication) {
        Equipo equipo = equipoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Equipo no encontrado."));

        Integer idEmpresaEquipo = equipo.getEmpresa() != null ? equipo.getEmpresa().getIdEmpresa() : null;
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        if (!tenantContext.coincideEmpresa(idEmpresaEquipo, idEmpresaActual)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Equipo no encontrado.");
        }

        EstadoEquipo estadoEquipo = estadoEquipoRepository.findById(request.idEstadoEquipo())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Estado de equipo no encontrado con ID: " + request.idEstadoEquipo()));

        Usuario usuarioRegistro = usuarioRepository.findById(request.idUsuarioRegistro())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario no encontrado con ID: " + request.idUsuarioRegistro()));

        Integer idEmpresaDelUsuarioRegistro = usuarioRegistro.getEmpresa() != null ? usuarioRegistro.getEmpresa().getIdEmpresa() : null;
        if (!tenantContext.coincideEmpresa(idEmpresaDelUsuarioRegistro, idEmpresaActual)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario de registro no encontrado.");
        }

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

    public void eliminar(Integer id, Authentication authentication) {
        Equipo equipo = equipoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Equipo no encontrado."));

        Integer idEmpresaEquipo = equipo.getEmpresa() != null ? equipo.getEmpresa().getIdEmpresa() : null;
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        if (!tenantContext.coincideEmpresa(idEmpresaEquipo, idEmpresaActual)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Equipo no encontrado.");
        }

        equipoRepository.delete(equipo);
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
