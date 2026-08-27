package com.mantenimiento.sigma_te.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ManejadorGlobalExcepciones {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> manejarError(ResponseStatusException ex) {
        Map<String, String> cuerpo = new HashMap<>();
        cuerpo.put("mensaje", ex.getReason());
        cuerpo.put("codigo", String.valueOf(ex.getStatusCode().value()));
        return ResponseEntity.status(ex.getStatusCode()).body(cuerpo);
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> manejarErrorIntegridad(
            org.springframework.dao.DataIntegrityViolationException ex) {
        Map<String, String> cuerpo = new HashMap<>();
        cuerpo.put("mensaje", "Ya existe un registro con ese valor único. Verifique los datos e intente de nuevo.");
        cuerpo.put("codigo", "409");
        return ResponseEntity.status(409).body(cuerpo);
    }
}
