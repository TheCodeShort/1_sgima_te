package com.mantenimiento.sigma_te.services;

import com.mantenimiento.sigma_te.dto.tiponotificacion.TipoNotificacionDTO;
import com.mantenimiento.sigma_te.dto.tiponotificacion.TipoNotificacionRequestDTO;
import com.mantenimiento.sigma_te.models.TipoNotificacion;
import com.mantenimiento.sigma_te.repositories.TipoNotificacionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TipoNotificacionService {
    private final TipoNotificacionRepository tipoNotificacionRepository;

    public TipoNotificacionService (TipoNotificacionRepository tipoNotificacionRepository){
        this.tipoNotificacionRepository = tipoNotificacionRepository;}


    public List<TipoNotificacionDTO> listarTodos(){
        return tipoNotificacionRepository.findAll()
                .stream()
                .map(this::convertirADto)
                .toList();
    }

    public TipoNotificacionDTO buscarPorId (Integer id){
        TipoNotificacion tipoNotificacion = tipoNotificacionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                                     HttpStatus.NOT_FOUND, "Id tipo notificacion no se encontro: " + id));
        return convertirADto(tipoNotificacion);
    }

    public TipoNotificacionDTO crear (TipoNotificacionRequestDTO request){
        TipoNotificacion tipoNotificacion = TipoNotificacion.builder()
                .nombreTipo(request.nombreTipo())
                .activo(request.activo())
                .build();
        TipoNotificacion guardado = tipoNotificacionRepository.save(tipoNotificacion);
        return convertirADto(guardado);
    }

    public TipoNotificacionDTO actualizar (Integer id, TipoNotificacionRequestDTO request){
        TipoNotificacion tipoNotificacion = tipoNotificacionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Id tipo notificacion no se encontro: " + id));
        tipoNotificacion.setNombreTipo(request.nombreTipo());
        tipoNotificacion.setActivo(request.activo());
        TipoNotificacion actualizado = tipoNotificacionRepository.save(tipoNotificacion);
        return convertirADto(actualizado);
    }

    public void eliminar (Integer id){
        if(!tipoNotificacionRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Tipo de notificacion no encontrada: " + id);

        }
    }

    public TipoNotificacionDTO convertirADto (TipoNotificacion tipoNotificacion){
        return new TipoNotificacionDTO(
                tipoNotificacion.getIdTipoNotificacion(),
                tipoNotificacion.getNombreTipo(),
                tipoNotificacion.getActivo()
        );
    }
}

