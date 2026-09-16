package com.mantenimiento.sigma_te.services;

import com.mantenimiento.sigma_te.dto.auditoria.AuditoriaDTO;
import com.mantenimiento.sigma_te.dto.auditoria.AuditoriaRequestDTO;
import com.mantenimiento.sigma_te.models.Empresa;
import com.mantenimiento.sigma_te.models.Equipo;
import com.mantenimiento.sigma_te.models.Auditoria;
import com.mantenimiento.sigma_te.models.Usuario;
import com.mantenimiento.sigma_te.repositories.EmpresaRepository;
import com.mantenimiento.sigma_te.repositories.EquipoRepository;
import com.mantenimiento.sigma_te.repositories.AuditoriaRepository;
import com.mantenimiento.sigma_te.repositories.UsuarioRepository;
import com.mantenimiento.sigma_te.security.TenantContext;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditoriaService {

    private final AuditoriaRepository auditoriaRepository;
    private final EquipoRepository equipoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmpresaRepository empresaRepository;
    private final TenantContext tenantContext;

    public AuditoriaService(AuditoriaRepository auditoriaRepository,
                                EquipoRepository equipoRepository,
                                UsuarioRepository usuarioRepository,
                                EmpresaRepository empresaRepository,
                                TenantContext tenantContext) {
        this.auditoriaRepository = auditoriaRepository;
        this.equipoRepository = equipoRepository;
        this.usuarioRepository = usuarioRepository;
        this.empresaRepository = empresaRepository;
        this.tenantContext = tenantContext;
    }

    public List<AuditoriaDTO> listarTodos(Authentication authentication) {
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        List<Auditoria> auditorias = idEmpresaActual == null
                ? auditoriaRepository.findByEmpresaIsNull()
                : auditoriaRepository.findByEmpresa_IdEmpresa(idEmpresaActual);

        return auditorias.stream()
                .map(this::convertirADto)
                .toList();
    }

    public AuditoriaDTO buscarPorId(Integer id, Authentication authentication) {
        Auditoria auditoria = auditoriaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Registro de auditoría no encontrado."));

        Integer idEmpresaAuditoria = auditoria.getEmpresa() != null ? auditoria.getEmpresa().getIdEmpresa() : null;
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        if (!tenantContext.coincideEmpresa(idEmpresaAuditoria, idEmpresaActual)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Registro de auditoría no encontrado.");
        }

        return convertirADto(auditoria);
    }

    public AuditoriaDTO crear(AuditoriaRequestDTO request, Authentication authentication) {
        Equipo equipo = null;
        if (request.idEquipo() != null) {
            equipo = equipoRepository.findById(request.idEquipo())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Equipo no encontrado con ID: " + request.idEquipo()));

            Integer idEmpresaEquipo = equipo.getEmpresa() != null ? equipo.getEmpresa().getIdEmpresa() : null;
            if (!tenantContext.coincideEmpresa(idEmpresaEquipo, tenantContext.obtenerIdEmpresaActual(authentication))) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipo no encontrado.");
            }
        }

        Usuario usuario = usuarioRepository.findById(request.idUsuario())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario no encontrado con ID: " + request.idUsuario()));

        Integer idEmpresaUsuario = usuario.getEmpresa() != null ? usuario.getEmpresa().getIdEmpresa() : null;
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);
        if (!tenantContext.coincideEmpresa(idEmpresaUsuario, idEmpresaActual)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado.");
        }

        Empresa empresa = null;
        if (idEmpresaActual != null) {
            empresa = empresaRepository.findById(idEmpresaActual)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Empresa no encontrada con ID: " + idEmpresaActual));
        }

        Auditoria auditoria = Auditoria.builder()
                .empresa(empresa)
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

    public AuditoriaDTO actualizar(Integer id, AuditoriaRequestDTO request, Authentication authentication) {
        Auditoria auditoria = auditoriaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Registro de auditoría no encontrado."));

        Integer idEmpresaAuditoria = auditoria.getEmpresa() != null ? auditoria.getEmpresa().getIdEmpresa() : null;
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        if (!tenantContext.coincideEmpresa(idEmpresaAuditoria, idEmpresaActual)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Registro de auditoría no encontrado.");
        }

        Equipo equipo = null;
        if (request.idEquipo() != null) {
            equipo = equipoRepository.findById(request.idEquipo())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Equipo no encontrado con ID: " + request.idEquipo()));

            Integer idEmpresaEquipo = equipo.getEmpresa() != null ? equipo.getEmpresa().getIdEmpresa() : null;
            if (!tenantContext.coincideEmpresa(idEmpresaEquipo, idEmpresaActual)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipo no encontrado.");
            }
        }

        Usuario usuario = usuarioRepository.findById(request.idUsuario())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario no encontrado con ID: " + request.idUsuario()));

        Integer idEmpresaUsuario = usuario.getEmpresa() != null ? usuario.getEmpresa().getIdEmpresa() : null;
        if (!tenantContext.coincideEmpresa(idEmpresaUsuario, idEmpresaActual)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado.");
        }

        auditoria.setEquipo(equipo);
        auditoria.setModulo(request.modulo());
        auditoria.setAccion(request.accion());
        auditoria.setUsuario(usuario);
        auditoria.setResultado(request.resultado());

        Auditoria actualizada = auditoriaRepository.save(auditoria);
        return convertirADto(actualizada);
    }

    public void eliminar(Integer id, Authentication authentication) {
        Auditoria auditoria = auditoriaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Registro de auditoría no encontrado."));

        Integer idEmpresaAuditoria = auditoria.getEmpresa() != null ? auditoria.getEmpresa().getIdEmpresa() : null;
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        if (!tenantContext.coincideEmpresa(idEmpresaAuditoria, idEmpresaActual)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Registro de auditoría no encontrado.");
        }

        auditoriaRepository.delete(auditoria);
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