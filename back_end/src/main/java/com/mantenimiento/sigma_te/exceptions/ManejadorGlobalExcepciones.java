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
}
