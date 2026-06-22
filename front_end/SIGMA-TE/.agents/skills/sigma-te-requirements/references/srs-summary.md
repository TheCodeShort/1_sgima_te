# SIGMA-TE — Resumen del SRS

## Propósito general
SIGMA-TE es un sistema de gestión de mantenimiento computarizado con trazabilidad de equipos. Su objetivo es permitir el registro, consulta, seguimiento y control de información relacionada con equipos, fallas, mantenimientos, evidencias y roles de usuario.

## Alcance funcional
El sistema contempla, como base, las siguientes capacidades:
- Registro y consulta de equipos.
- Consulta de la hoja de vida de cada equipo.
- Reporte de fallas.
- Gestión de mantenimientos.
- Carga y consulta de evidencias.
- Control por roles.
- Trazabilidad del historial de cada equipo.
- Operación con enfoque offline-first.

## Roles principales
- Administrador
- Supervisor de calidad
- Auditor
- Operario
- Técnico

## Principios del sistema
- La trazabilidad es obligatoria.
- Cada acción importante debe quedar registrada.
- El sistema debe respetar permisos por rol.
- El sistema debe conservar historial.
- El sistema debe ser útil incluso sin conexión inmediata.

## Qué no debe asumir esta skill
- No inventar módulos fuera del SRS.
- No cambiar el alcance.
- No introducir funciones no justificadas.
- No redefinir la arquitectura técnica.

## Uso de este archivo
Este documento sirve como contexto base para redactar requisitos, historias de usuario y criterios de aceptación sin perder la intención original del proyecto.