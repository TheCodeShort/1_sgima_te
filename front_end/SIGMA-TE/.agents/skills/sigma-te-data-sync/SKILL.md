---
name: sigma-te-data-sync
description: Define persistencia local, sincronización, colas, conflictos y recuperación de datos para SIGMA-TE.
---

# SIGMA-TE Data Sync

## Propósito
Esta skill define cómo SIGMA-TE guarda, sincroniza y recupera datos entre el modo local y el almacenamiento remoto.

## Cuándo usarla
- Cuando el sistema deba trabajar sin conexión y luego sincronizar.
- Cuando haya datos locales y remotos.
- Cuando se deba resolver conflicto entre versiones.
- Cuando aparezca una cola de cambios pendientes.
- Cuando se necesite definir estrategia de respaldo o reconciliación.

## Guardrails
⚠️ No diseñar la UI.
⚠️ No redefinir el dominio.
⚠️ No inventar reglas de negocio nuevas.
⚠️ No ocultar conflictos con soluciones vagas.
⚠️ No asumir que la red siempre está disponible.

## Principio central
SI un dato se crea sin conexión,
ENTONCES debe quedar pendiente de sincronización.
SI el mismo dato cambió en dos sitios,
ENTONCES debe existir una regla de resolución.
SI la sincronización falla,
ENTONCES el sistema debe conservar trazabilidad del error.

## Flujo de trabajo
-> Identificar qué dato se generó o cambió.
-> Determinar si está local, remoto o en cola.
-> Definir el momento de sincronización.
-> Revisar si existe conflicto.
-> Aplicar la regla de resolución correcta.
-> Registrar el resultado.
-> Garantizar que no se pierdan datos.

## Elementos que cubre
- Persistencia local temporal.
- Cola de cambios.
- Envío diferido.
- Recepción de cambios.
- Conflictos.
- Reintentos.
- Estado de sincronización.
- Trazabilidad técnica.

## Reglas de resolución
- Nunca perder un dato sin decisión explícita.
- Nunca sobrescribir sin registrar.
- Nunca asumir que el remoto siempre tiene la verdad.
- Nunca dejar conflictos invisibles.
- Toda resolución debe poder explicarse.

## Checklist interno
- [ ] Detecté el origen del dato.
- [ ] Identifiqué el estado de sincronización.
- [ ] Revisé si hay conflicto.
- [ ] Definí una resolución clara.
- [ ] Conservo historial.
- [ ] Evité mezclar interfaz o dominio.

## Estilo de respuesta
- Técnico.
- Secuencial.
- Claro.
- Sin salirse del problema de sincronización.