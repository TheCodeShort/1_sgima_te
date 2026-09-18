package com.mantenimiento.sigma_te.services;

import com.mantenimiento.sigma_te.dto.rol.RolDTO;
import com.mantenimiento.sigma_te.dto.rol.RolRequestDTO;
import com.mantenimiento.sigma_te.models.Empresa;
import com.mantenimiento.sigma_te.models.Rol;
import com.mantenimiento.sigma_te.repositories.EmpresaRepository;
import com.mantenimiento.sigma_te.repositories.RolRepository;
import com.mantenimiento.sigma_te.security.TenantContext;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class RolService {

    private final RolRepository rolRepository;
    private final EmpresaRepository empresaRepository;
    private final TenantContext tenantContext;

    public RolService(RolRepository rolRepository,
                       EmpresaRepository empresaRepository,
                       TenantContext tenantContext) {
        this.rolRepository = rolRepository;
        this.empresaRepository = empresaRepository;
        this.tenantContext = tenantContext;
    }

    public List<RolDTO> listarTodos(Authentication authentication) {
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        List<Rol> roles = idEmpresaActual == null
                ? rolRepository.findAll()
                : rolRepository.findByEmpresa_IdEmpresa(idEmpresaActual);

        return roles.stream()
                .map(this::convertirADto)
                .toList();
    }

    public RolDTO buscarPorId(Integer id, Authentication authentication) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Rol no encontrado con ID: " + id));

        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        if (idEmpresaActual != null) {
            Integer idEmpresaRol = rol.getEmpresa() != null ? rol.getEmpresa().getIdEmpresa() : null;
            if (!tenantContext.coincideEmpresa(idEmpresaRol, idEmpresaActual)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Rol no encontrado.");
            }
        }

        return convertirADto(rol);
    }

    public RolDTO crear(RolRequestDTO request, Authentication authentication) {
        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        Empresa empresa = null;
        if (idEmpresaActual != null) {
            empresa = empresaRepository.findById(idEmpresaActual)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Empresa no encontrada con ID: " + idEmpresaActual));
        }

        Rol rol = Rol.builder()
                .empresa(empresa)
                .nombreRol(request.nombreRol())
                .descripcionRol(request.descripcionRol())
                .estadoRol(true)
                .build();
        Rol guardado = rolRepository.save(rol);
        return convertirADto(guardado);
    }

    public RolDTO actualizar(Integer id, RolRequestDTO request, Authentication authentication) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Rol no encontrado con ID: " + id));

        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        if (idEmpresaActual != null) {
            Integer idEmpresaRol = rol.getEmpresa() != null ? rol.getEmpresa().getIdEmpresa() : null;
            if (!tenantContext.coincideEmpresa(idEmpresaRol, idEmpresaActual)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Rol no encontrado.");
            }
        }

        if (Boolean.TRUE.equals(rol.getEsProtegido())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Este rol está protegido y no puede modificarse desde aquí.");
        }

        rol.setNombreRol(request.nombreRol());
        rol.setDescripcionRol(request.descripcionRol());
        rol.setEstadoRol(request.estadoRol());
        Rol actualizado = rolRepository.save(rol);
        return convertirADto(actualizado);
    }

    public void eliminar(Integer id, Authentication authentication) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Rol no encontrado con ID: " + id));

        Integer idEmpresaActual = tenantContext.obtenerIdEmpresaActual(authentication);

        if (idEmpresaActual != null) {
            Integer idEmpresaRol = rol.getEmpresa() != null ? rol.getEmpresa().getIdEmpresa() : null;
            if (!tenantContext.coincideEmpresa(idEmpresaRol, idEmpresaActual)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Rol no encontrado.");
            }
        }

        if (Boolean.TRUE.equals(rol.getEsProtegido())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Este rol está protegido y no puede eliminarse.");
        }

        rolRepository.deleteById(id);
    }

    private RolDTO convertirADto(Rol rol) {
        String nombreVisible = (Boolean.TRUE.equals(rol.getEsProtegido()) && rol.getEmpresa() != null)
                ? "Admin - " + rol.getEmpresa().getNombreEmpresa()
                : rol.getNombreRol();
        return new RolDTO(
                rol.getIdRol(),
                rol.getNombreRol(),
                rol.getDescripcionRol(),
                rol.getEstadoRol(),
                rol.getEsProtegido(),
                nombreVisible
        );
    }
}
