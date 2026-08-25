package com.mantenimiento.sigma_te.controllers;

import com.mantenimiento.sigma_te.dto.tiponotificacion.TipoNotificacionDTO;
import com.mantenimiento.sigma_te.dto.tiponotificacion.TipoNotificacionRequestDTO;
import com.mantenimiento.sigma_te.repositories.TipoNotificacionRepository;
import com.mantenimiento.sigma_te.services.TipoNotificacionService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tipo-notificacion")
public class TipoNotificacionController {

    private final TipoNotificacionService tipoNotificacionService;

    public TipoNotificacionController (TipoNotificacionService tipoNotificacionService){
        this.tipoNotificacionService = tipoNotificacionService;
    }

    @GetMapping
    public List<TipoNotificacionDTO> listarTodos(){
        return tipoNotificacionService.listarTodos();
    }

    @GetMapping("/{id}")
    public TipoNotificacionDTO buscarPorId(@PathVariable Integer id){
        return tipoNotificacionService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TipoNotificacionDTO crear(@RequestBody TipoNotificacionRequestDTO request){
        return tipoNotificacionService.crear(request);
    }

    @PutMapping("/{id}")
    public TipoNotificacionDTO actualizar(@PathVariable Integer id, @RequestBody TipoNotificacionRequestDTO request){
        return tipoNotificacionService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {tipoNotificacionService.eliminar(id);}
}
