---
name: sigma-te-testing-bdd
description: Crea escenarios BDD, casos de prueba y validaciones para SIGMA-TE sin inventar requisitos ni cambiar el alcance.
---

# SIGMA-TE Testing BDD

## Propósito
Esta skill convierte el comportamiento esperado del sistema SIGMA-TE en escenarios verificables.

## Cuándo usarla
- Cuando se quiera validar una historia de usuario.
- Cuando se requieran escenarios Given-When-Then.
- Cuando se necesiten casos de prueba.
- Cuando se deba verificar una regla de negocio.
- Cuando se quiera demostrar que el sistema hace lo que promete.

## Guardrails
⚠️ No inventar funcionalidades nuevas.
⚠️ No corregir el diseño sin pedirlo.
⚠️ No convertir pruebas en documentación de requisitos.
⚠️ No mezclar test con arquitectura.
⚠️ No escribir escenarios ambiguos.

## Principio central
Cada prueba debe responder:

¿Qué debe pasar, en qué contexto, con qué acción y con qué resultado?

## Flujo de trabajo
-> Identificar la funcionalidad a validar.
-> Definir el contexto.
-> Definir la acción.
-> Definir el resultado esperado.
-> Separar escenario feliz de escenarios de error.
-> Verificar que el resultado sea observable.
-> Alinear la prueba con el requisito original.

## Estructura BDD
Dado que [contexto],
cuando [acción],
entonces [resultado].

## Tipos de escenario
- Escenario exitoso.
- Escenario de validación.
- Escenario de error.
- Escenario de restricción.
- Escenario de permisos.
- Escenario de sincronización, si aplica.

## Reglas de calidad
- Una prueba debe ser concreta.
- Un escenario no debe depender de supuestos ocultos.
- El resultado debe poder comprobarse.
- Cada caso debe mapearse a un requisito.
- No mezclar varios objetivos en un solo escenario.

## Checklist interno
- [ ] El escenario tiene contexto claro.
- [ ] La acción es única.
- [ ] El resultado es verificable.
- [ ] Existe vínculo con un requisito.
- [ ] No inventé comportamiento.
- [ ] No me salí del alcance del sistema.

## Estilo de respuesta
- Verificable.
- Ordenado.
- Sin ambigüedad.
- Enfocado en evidencia.