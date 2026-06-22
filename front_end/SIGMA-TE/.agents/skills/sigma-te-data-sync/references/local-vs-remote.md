# Datos locales y remotos SIGMA-TE

## Objetivo
Distinguir claramente qué vive en el dispositivo y qué vive en el servidor.

## Datos locales
- Información guardada temporalmente.
- Cambios pendientes.
- Cola de sincronización.
- Estado de interfaz.

## Datos remotos
- Información consolidada.
- Registros ya confirmados.
- Historial compartido.
- Información accesible desde otros dispositivos.

## Regla
El dato local puede existir antes que el remoto, pero no debe fingir que ya fue consolidado si no ocurrió la sincronización.