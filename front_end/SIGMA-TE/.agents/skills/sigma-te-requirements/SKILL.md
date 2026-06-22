---
name: sigma-te-requirements
description: Convierte la guía, el SRS y las notas de SIGMA-TE en requisitos, historias de usuario, criterios de aceptación y trazabilidad.
---

# SIGMA-TE Requirements

## Propósito
Esta skill se encarga de transformar información del proyecto SIGMA-TE en requisitos claros, consistentes y trazables.

## Cuándo usarla
- Cuando el usuario entregue una idea y pida convertirla en requisito.
- Cuando haya que redactar o revisar historias de usuario.
- Cuando se necesiten criterios de aceptación.
- Cuando se deba ordenar el alcance del sistema.
- Cuando se deba verificar si una funcionalidad pertenece o no al proyecto.

## Guardrails
⚠️ No diseñar arquitectura técnica.
⚠️ No definir tablas de base de datos.
⚠️ No crear estados del dominio si no son necesarios.
⚠️ No agregar módulos fuera del alcance del SRS.
⚠️ No prometer funciones futuras como si ya estuvieran definidas.

## Principio central
Esta skill trabaja con la filosofía:

SI el usuario pide una necesidad,
ENTONCES se convierte en requisito.
SI el requisito afecta el comportamiento del sistema,
ENTONCES se define historia de usuario.
SI la historia necesita validación,
ENTONCES se redacta criterio de aceptación.

## Flujo de trabajo
-> Leer el contexto del proyecto SIGMA-TE.
-> Identificar la necesidad real.
-> Separar lo que es requisito de lo que es solución.
-> Redactar la funcionalidad en lenguaje claro.
-> Definir actor, intención, valor y resultado esperado.
-> Confirmar que el requisito no contradice el SRS.
-> Si aplica, convertirlo en historia de usuario.
-> Si aplica, derivar criterios de aceptación.

## Formato recomendado para requisitos
- Nombre del requisito.
- Descripción breve.
- Actor involucrado.
- Necesidad que resuelve.
- Regla o restricción asociada.
- Relación con otros requisitos.
- Prioridad.

## Formato recomendado para historias de usuario
Como [tipo de usuario],
quiero [acción],
para [beneficio].

## Formato recomendado para criterios de aceptación
Dado que [contexto],
cuando [acción],
entonces [resultado esperado].

## Reglas de calidad
- El requisito debe ser verificable.
- El texto debe ser específico.
- Debe evitarse lenguaje ambiguo.
- No deben mezclarse solución y necesidad.
- La redacción debe conservar el contexto SIGMA-TE.

## Checklist interno
- [ ] Identifiqué la necesidad real.
- [ ] Eliminé soluciones innecesarias.
- [ ] Redacté en lenguaje verificable.
- [ ] Confirmé actor y valor.
- [ ] Verifiqué trazabilidad con el SRS.
- [ ] No inventé funciones nuevas.

## Ejemplos de uso
- Convertir “registrar equipos” en requisitos.
- Convertir “consultar hoja de vida del equipo” en historias de usuario.
- Convertir “reportar una falla” en criterios de aceptación.

## Estilo de respuesta
- Preciso.
- Trazable.
- Sin desbordar alcance.
- Sin hablar de implementación si no se pide.