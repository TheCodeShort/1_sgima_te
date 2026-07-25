# Reglas de reintento SIGMA-TE

## Objetivo
Definir qué pasa cuando la sincronización falla.

## Reglas
- Debe existir reintento.
- El reintento debe ser controlado.
- El sistema no debe saturar la red con intentos infinitos.
- El usuario debe saber que quedó pendiente.
- Si el error persiste, debe registrarse como incidente técnico.

## Flujo
1. Falló el envío.
2. Se marca el pendiente.
3. Se programa reintento.
4. Si vuelve a fallar, se conserva evidencia.
5. Si se supera el límite definido, se notifica el problema.

## Criterio
El reintento debe ayudar a recuperar datos, no a ocultar fallas.