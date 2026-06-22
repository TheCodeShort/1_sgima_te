# Flujo offline-first SIGMA-TE

## Objetivo
Definir el comportamiento básico de la aplicación cuando no hay conexión.

## Principio
El sistema debe seguir siendo útil aun sin internet.

## Flujo general
1. El usuario realiza una acción.
2. Si hay conexión, el sistema puede sincronizar de inmediato.
3. Si no hay conexión, el sistema guarda localmente la acción.
4. La acción queda pendiente de sincronización.
5. Cuando regresa la conexión, el sistema reintenta enviar la información.

## Qué se espera en modo offline
- Guardar datos localmente.
- Permitir consultas disponibles.
- Evitar pérdida de información.
- Mostrar estado claro al usuario.

## Qué no debe hacer
- Bloquear toda la aplicación por falta de red.
- Hacer creer que se guardó en remoto si no pasó.
- Ocultar errores de sincronización.

## Idea central
Offline-first no significa “trabajar a ciegas”; significa que la app sigue funcionando con control y claridad.