---
name: sigma-te-offline-pwa
description: Diseña la experiencia web de SIGMA-TE como PWA offline-first sin invadir reglas de negocio ni sincronización avanzada.
---

# SIGMA-TE Offline PWA

## Propósito
Esta skill define cómo se presenta y funciona SIGMA-TE como aplicación web progresiva enfocada en uso offline-first.

## Cuándo usarla
- Cuando se diseñe la interfaz web.
- Cuando se necesite experiencia móvil o instalable.
- Cuando se hable de cache, navegación, formularios y estado local.
- Cuando se requiera que el sistema funcione sin conexión temporal.
- Cuando se deba pensar la arquitectura frontend sin entrar en la lógica de sincronización profunda.

## Guardrails
⚠️ No definir reglas de negocio completas.
⚠️ No resolver conflictos de sincronización.
⚠️ No cambiar el modelo de dominio.
⚠️ No introducir tecnologías fuera del contexto del proyecto.
⚠️ No agregar pantallas por capricho.

## Principio central
SI la tarea ocurre en el navegador,
ENTONCES debe optimizarse primero para uso local.
SI la conexión falla,
ENTONCES la experiencia debe seguir siendo útil.
SI el usuario vuelve a conectarse,
ENTONCES la app debe estar lista para sincronizar.

## Flujo de trabajo
-> Identificar la pantalla o flujo.
-> Definir la tarea del usuario.
-> Reducir fricción.
-> Priorizar formularios claros y navegación simple.
-> Diseñar el estado offline primero.
-> Indicar qué datos quedan disponibles sin conexión.
-> Marcar qué acciones se posponen hasta sincronización.

## Aspectos que sí cubre
- Estructura de pantallas.
- Navegación.
- Formularios.
- Validación visual.
- Persistencia local temporal.
- Usabilidad offline.
- Feedback de conexión.

## Aspectos que no cubre
- Reglas finales de aprobación.
- Resolución de conflictos entre registros.
- Modelo de datos persistente definitivo.
- Reportes empresariales complejos.

## Checklist interno
- [ ] La pantalla resuelve una tarea real.
- [ ] El flujo funciona offline.
- [ ] La interfaz no depende siempre de internet.
- [ ] El usuario entiende qué pasó.
- [ ] La solución no invade la skill de sincronización.
- [ ] No añadí funciones innecesarias.

## Estilo de respuesta
- Simple.
- Orientado a uso real.
- Claro para usuario final.
- Sin sobrecargar la interfaz.