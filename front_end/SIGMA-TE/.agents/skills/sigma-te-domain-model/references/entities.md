# Entidades del dominio SIGMA-TE

## Usuario
Representa a la persona que interactúa con el sistema.

Atributos base:
- id
- nombre
- correo
- rol
- estado

## Rol
Define el tipo de acceso y responsabilidad dentro del sistema.

Roles base:
- Administrador
- Supervisor de calidad
- Auditor
- Operario
- Técnico

## Equipo
Representa el activo o elemento que será gestionado y trazado.

Atributos base:
- id
- nombre
- código
- descripción
- estado_operativo
- ubicación
- historial

## Falla
Registra un evento de anomalía o problema detectado en un equipo.

Atributos base:
- id
- equipo_id
- descripción
- fecha_reporte
- reportado_por
- estado

## Mantenimiento
Representa una intervención técnica o preventiva sobre un equipo.

Atributos base:
- id
- equipo_id
- tipo
- fecha
- responsable
- resultado
- observaciones

## Evidencia
Permite respaldar registros, acciones o resultados del sistema.

Atributos base:
- id
- tipo
- referencia
- fecha
- asociado_a

## Historial
Consolida los eventos relevantes de un equipo a lo largo del tiempo.

Atributos base:
- id
- equipo_id
- eventos
- fecha_actualizacion

## Registro de actividad
Guarda las acciones operativas realizadas dentro del sistema.

Atributos base:
- id
- usuario_id
- accion
- fecha
- detalle