# Reglas de negocio SIGMA-TE

## Reglas generales
- Todo equipo debe tener trazabilidad.
- Toda falla debe quedar registrada.
- Todo mantenimiento debe conservar evidencia.
- Todo cambio importante debe quedar asociado a un usuario.
- Todo rol debe respetar sus permisos.

## Reglas sobre equipos
- Un equipo no puede perder su historial.
- Un equipo debe poder consultarse en cualquier momento.
- Un equipo solo puede cambiar de estado mediante un evento válido.

## Reglas sobre fallas
- Una falla debe estar asociada a un equipo.
- Una falla debe tener fecha y responsable del reporte.
- Una falla no debe existir sin contexto operativo.

## Reglas sobre mantenimientos
- Todo mantenimiento debe indicar tipo, fecha y responsable.
- Un mantenimiento debe dejar rastro verificable.
- Un mantenimiento debe poder relacionarse con una falla o necesidad de intervención.

## Reglas sobre evidencia
- La evidencia debe vincularse con una acción concreta.
- La evidencia no debe quedar aislada del flujo del sistema.
- La evidencia debe permitir respaldo operativo o documental.

## Reglas sobre acceso
- Cada rol debe ver y hacer solo lo que le corresponde.
- Las acciones críticas deben tener control de permiso.
- El sistema no debe asumir privilegios por defecto.

## Regla principal
Si una acción rompe trazabilidad, coherencia o control por rol, esa acción no debe permitirse.