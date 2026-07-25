# Política de sincronización SIGMA-TE

## Objetivo
Definir cómo se mueve la información entre almacenamiento local y remoto.

## Principios
- No perder datos.
- No ocultar conflictos.
- No asumir que la red siempre existe.
- No sobrescribir sin control.
- Mantener trazabilidad del proceso.

## Flujo base
- El dato se crea o modifica localmente.
- Se marca como pendiente.
- El sistema intenta sincronizar.
- Si la sincronización funciona, se confirma.
- Si falla, se conserva localmente y se reintenta.

## Regla central
La sincronización debe ser segura antes que rápida.