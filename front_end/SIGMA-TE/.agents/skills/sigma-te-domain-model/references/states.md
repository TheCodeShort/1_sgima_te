# Estados del equipo SIGMA-TE

## Objetivo
Definir el comportamiento operativo del equipo dentro del sistema sin ambigüedad.

## Estados base
### Disponible
El equipo está apto para operar normalmente.

Permite:
- consultar
- asignar
- registrar observaciones

### En revisión
El equipo está siendo evaluado.

Permite:
- consultar
- registrar hallazgos
- iniciar seguimiento

### Con falla
El equipo presenta una anomalía reportada.

Permite:
- registrar mantenimiento correctivo
- consultar historial
- asociar evidencia

### En mantenimiento
El equipo está bajo intervención técnica.

Permite:
- registrar actividades
- adjuntar evidencia
- actualizar avance

### Mantenido
El mantenimiento ya fue ejecutado y registrado.

Permite:
- verificar resultado
- consultar cierre
- revisar evidencia

### Fuera de servicio
El equipo no debe operar hasta nueva validación.

Permite:
- consultar
- registrar incidencia
- planear intervención

## Reglas de estado
- Un equipo solo puede estar en un estado activo a la vez.
- Toda transición debe tener un evento justificable.
- No se debe saltar a un estado sin respaldo operativo.
- El estado debe reflejar la realidad del equipo, no una intención abstracta.