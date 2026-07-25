# Architecture Overview\n\n*Provide architecture details here.*
# SIGMA-TE — Architecture Overview

## Propósito
Este documento resume la arquitectura general de SIGMA-TE en su enfoque web PWA offline-first.

## Visión general
SIGMA-TE se plantea como una aplicación web progresiva orientada a operar de forma confiable aun cuando la conexión a internet no esté disponible. La solución prioriza la experiencia local del usuario, la persistencia temporal de datos y la sincronización posterior con un almacenamiento remoto.

## Principios arquitectónicos
- Prioridad al uso offline.
- Separación clara entre interfaz, persistencia local y sincronización remota.
- Trazabilidad de cada acción importante.
- Arquitectura simple y mantenible para un proyecto desarrollado por una sola persona.
- Escalabilidad por fases, no por sobrecarga inicial.

## Capas principales

### 1. Capa de presentación
Corresponde a la interfaz del sistema.
Incluye:
- pantallas
- formularios
- navegación
- validación visual
- mensajes de estado
- feedback de conexión

### 2. Capa de lógica de interacción
Gestiona el comportamiento de la interfaz y el flujo de acciones del usuario.
Incluye:
- captura de eventos
- validaciones inmediatas
- control de estado de la vista
- preparación de datos para almacenamiento

### 3. Capa de almacenamiento local
Permite guardar datos en el dispositivo para mantener la operación aun sin conexión.
Incluye:
- IndexedDB
- colas de acciones pendientes
- borradores temporales
- caché de información esencial

### 4. Capa de sincronización
Se encarga de enviar y recibir datos entre el almacenamiento local y la nube.
Incluye:
- detección de cambios pendientes
- reintentos
- resolución de conflictos
- actualización de estados de sincronización

### 5. Capa remota
Representa el almacenamiento persistente en la nube.
Incluye:
- base de datos remota
- almacenamiento de archivos o evidencias
- historial consolidado
- respaldo de información compartida

## Flujo general de funcionamiento
1. El usuario interactúa con la interfaz.
2. La aplicación valida la acción.
3. El dato se guarda en almacenamiento local.
4. Si hay conexión, el sistema intenta sincronizar.
5. Si no hay conexión, el dato queda pendiente.
6. Cuando vuelve la conexión, la sincronización se reintenta.
7. El sistema conserva trazabilidad del proceso.

## Componentes clave
- Frontend web
- Service Worker
- IndexedDB
- Módulo de sincronización
- Módulo de manejo de archivos o evidencias
- Repositorio remoto de datos

## Reglas arquitectónicas
- La interfaz no debe depender de la red para operar en lo esencial.
- La persistencia local debe evitar pérdida de información.
- La sincronización no debe ocultar errores.
- La arquitectura no debe mezclar lógica de negocio con detalles de interfaz.
- Las decisiones técnicas deben mantener coherencia con el alcance real del proyecto.

## Relación con el resto del sistema
Este archivo sirve como contexto técnico general para la skill de interfaz offline-first. No reemplaza el modelo de dominio ni la política de sincronización; solo describe cómo se organiza la solución a nivel de arquitectura.