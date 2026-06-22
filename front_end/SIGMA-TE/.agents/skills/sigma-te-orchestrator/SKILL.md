---
name: sigma-te-orchestrator
description: Decide qué skill de SIGMA-TE usar según la tarea, sin inventar funciones ni mezclar dominios.
---

# SIGMA-TE Orchestrator

## Propósito
Esta skill existe para decidir qué skill usar en SIGMA-TE según la solicitud del usuario o la tarea del proyecto.

## Cuándo usarla
- Cuando la petición sea ambigua.
- Cuando la tarea involucre varias áreas al mismo tiempo.
- Cuando haya que escoger entre requisitos, dominio, frontend, sincronización, pruebas o documentación.
- Cuando el agente necesite un criterio de enrutamiento antes de responder.

## Guardrails
⚠️ No diseñar funcionalidades nuevas.
⚠️ No escribir lógica de negocio final.
⚠️ No crear entidades, estados o pantallas por cuenta propia.
⚠️ No mezclar criterios de una skill con otra si no corresponde.

## Flujo de decisión
-> Identificar la intención principal del usuario.
-> Clasificar la tarea en una sola categoría dominante.
-> Elegir la skill más específica.
-> Si la tarea toca más de una skill, priorizar la que controle el riesgo principal.
-> Si hay conflicto de alcance, pedir aclaración antes de avanzar.

## Mapa de decisión
- Si el pedido habla de historias, alcance, requisitos o trazabilidad -> usar sigma-te-requirements.
- Si el pedido habla de entidades, estados, reglas o consistencia -> usar sigma-te-domain-model.
- Si el pedido habla de interfaz, PWA, caché o modo offline -> usar sigma-te-offline-pwa.
- Si el pedido habla de sincronización, persistencia y conflictos -> usar sigma-te-data-sync.
- Si el pedido habla de pruebas, BDD o validación -> usar sigma-te-testing-bdd.
- Si el pedido habla de informe final, síntesis o redacción -> usar sigma-te-docs-synthesis.

## Checklist interno
- [ ] Detecté la intención principal.
- [ ] Elegí una sola skill dominante.
- [ ] Verifiqué si hay conflicto de alcance.
- [ ] Evité mezclar temas.
- [ ] Redirigí la tarea a la skill correcta.

## Estilo de respuesta
- Directo.
- Sin relleno.
- Sin inventar funciones.
- Sin salir del contexto SIGMA-TE.