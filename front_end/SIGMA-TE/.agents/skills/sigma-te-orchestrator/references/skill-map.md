# Mapa de decisión de skills SIGMA-TE

## Regla de selección
SI la tarea trata de alcance, requisitos o historias,
ENTONCES usar sigma-te-requirements.

SI la tarea trata de entidades, estados o reglas,
ENTONCES usar sigma-te-domain-model.

SI la tarea trata de interfaz, pantallas o uso sin conexión,
ENTONCES usar sigma-te-offline-pwa.

SI la tarea trata de sincronización o conflictos,
ENTONCES usar sigma-te-data-sync.

SI la tarea trata de pruebas o validación,
ENTONCES usar sigma-te-testing-bdd.

SI la tarea trata de redacción final o informe,
ENTONCES usar sigma-te-docs-synthesis.

## Prioridad
1. Dominio
2. Requisitos
3. Sincronización
4. Interfaz
5. Pruebas
6. Síntesis

## Regla
Si la tarea mezcla varias áreas, elegir la skill que controle el riesgo principal.