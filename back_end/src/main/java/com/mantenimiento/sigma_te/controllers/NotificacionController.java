package com.mantenimiento.sigma_te.controllers;

import com.mantenimiento.sigma_te.dto.notificacion.NotificacionDTO;
import com.mantenimiento.sigma_te.dto.notificacion.NotificacionRequestDTO;
import com.mantenimiento.sigma_te.services.NotificacionService;
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
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    private final NotificacionService notificacionService;

    public NotificacionController(NotificacionService notificacionService) {
        this.notificacionService = notificacionService;
    }

    @GetMapping
    public List<NotificacionDTO> listarTodos() {
        return notificacionService.listarTodos();
    }

    @GetMapping("/{id}")
    public NotificacionDTO buscarPorId(@PathVariable Integer id) {
        return notificacionService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(value = HttpStatus.CREATED, reason = "Se creo una nueva notificacion")
    public NotificacionDTO crear(@RequestBody NotificacionRequestDTO request) {
        return notificacionService.crear(request);
    }

    @PutMapping("/{id}")
    public NotificacionDTO actualizar(@PathVariable Integer id, @RequestBody NotificacionRequestDTO request) {
        return notificacionService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(value = HttpStatus.NO_CONTENT, reason = "Se borro una notificacion")
    public void eliminar(@PathVariable Integer id) {
        notificacionService.eliminar(id);
    }
}
