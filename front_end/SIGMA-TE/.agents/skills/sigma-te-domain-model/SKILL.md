---
name: sigma-te-domain-model
description: Define entidades, estados, reglas de negocio y transiciones del dominio SIGMA-TE sin mezclar interfaz ni arquitectura.
---

# SIGMA-TE Domain Model

## Propósito
Esta skill define el corazón funcional del sistema SIGMA-TE: entidades, relaciones, estados, reglas y transiciones válidas.

## Cuándo usarla
- Cuando haya que definir el modelo del equipo.
- Cuando se necesiten estados operativos.
- Cuando se deban validar reglas de negocio.
- Cuando aparezcan dudas sobre qué puede hacer un rol según el estado del equipo.
- Cuando se necesite consistencia entre documentos, historias y flujo del sistema.

## Guardrails
⚠️ No diseñar pantallas.
⚠️ No hablar de frameworks.
⚠️ No definir API ni base de datos física.
⚠️ No crear comportamiento fuera del dominio.
⚠️ No permitir transiciones de estado inválidas.

## Entidades principales del dominio
- Usuario
- Rol
- Equipo
- Estado de equipo
- Falla
- Mantenimiento
- Evidencia
- Historial
- Registro de actividad

## Principio central
La lógica debe responder siempre a esta pregunta:

¿La acción es válida para este estado, este rol y este contexto?

Si la respuesta es no, la acción no debe permitirarse.

## Flujo de trabajo
-> Identificar la entidad principal.
-> Definir sus atributos esenciales.
-> Establecer relaciones con otras entidades.
-> Definir el estado actual si aplica.
-> Enumerar acciones permitidas.
-> Enumerar acciones prohibidas.
-> Crear transiciones válidas entre estados.
-> Revisar que cada regla tenga sentido operativo.
-> Verificar que no haya contradicción con requisitos o trazabilidad.

## Modelo de estados
Cada estado debe responder:
- Qué significa.
- Qué acciones permite.
- Qué acciones bloquea.
- Qué evento lo cambia.
- Qué rol puede intervenir.

## Guardrails de estados
⚠️ Un equipo no puede pasar a un estado incompatible sin evento justificado.
⚠️ Un rol no puede ejecutar una acción que no corresponde a su permiso.
⚠️ Un estado no puede existir sin definición operativa.

## Reglas de negocio
- Todo cambio importante debe quedar trazado.
- Toda falla debe tener un origen y un responsable del registro.
- Todo mantenimiento debe dejar evidencia.
- Todo equipo debe conservar su historial.
- Toda transición debe ser explicable.

## Checklist interno
- [ ] Definí la entidad correcta.
- [ ] Identifiqué estados y relaciones.
- [ ] Validé acciones permitidas y prohibidas.
- [ ] Revisé la trazabilidad.
- [ ] Evité mezclar interfaz o tecnología.
- [ ] Mantengo coherencia con SIGMA-TE.

## Estilo de respuesta
- Lógico.
- Preciso.
- Sin adornos.
- Sin salir del núcleo del dominio.