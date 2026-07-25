# Transiciones válidas de estado SIGMA-TE

## Objetivo
Definir cómo puede cambiar el estado de un equipo sin contradicciones.

## Transiciones principales

Disponible -> En revisión
Cuando se detecta la necesidad de inspección o verificación.

En revisión -> Disponible
Cuando se confirma que no existe problema.

En revisión -> Con falla
Cuando se valida una anomalía.

Con falla -> En mantenimiento
Cuando se asigna intervención correctiva o preventiva.

En mantenimiento -> Mantenido
Cuando el mantenimiento termina y queda registrado.

Mantenido -> Disponible
Cuando el equipo queda habilitado nuevamente.

Con falla -> Fuera de servicio
Cuando la condición del equipo impide su uso.

Fuera de servicio -> En mantenimiento
Cuando se aprueba intervención técnica.

Fuera de servicio -> Disponible
Solo si una validación posterior lo permite.

## Reglas de transición
- No se permiten saltos arbitrarios.
- Toda transición necesita justificación.
- Toda transición debe poder rastrearse.
- El resultado de la transición debe ser coherente con el historial.
- El rol que ejecuta la transición debe tener permiso para ello.