---
name: sigma-te-ui-design
description: Define la identidad visual, experiencia de usuario y reglas de diseño de SIGMA-TE sin alterar lógica de negocio ni arquitectura técnica.
---

# SIGMA-TE UI Design

## Propósito
Esta skill controla cómo debe verse y sentirse SIGMA-TE visualmente.

Su objetivo es evitar inconsistencias visuales, diseños improvisados y estilos que contradigan la identidad del sistema.

## Cuándo usarla
- Cuando se diseñen pantallas.
- Cuando se generen interfaces HTML/CSS.
- Cuando se usen herramientas como Stitch.
- Cuando se definan componentes visuales.
- Cuando se necesite consistencia visual.
- Cuando se construya experiencia web o desktop-like.

## Cuándo NO usarla
- Para definir reglas de negocio.
- Para modelar entidades.
- Para resolver sincronización.
- Para escribir pruebas.
- Para redefinir arquitectura backend.

## Guardrails
⚠️ No usar colores aleatorios.
⚠️ No mezclar estilos incompatibles.
⚠️ No crear interfaces caricaturescas.
⚠️ No saturar la interfaz con efectos innecesarios.
⚠️ No romper consistencia visual entre pantallas.
⚠️ No usar componentes visuales sin propósito funcional.

## Principio central
La interfaz debe sentirse:
- profesional
- técnica
- clara
- oscura
- moderna
- usable
- enfocada en productividad

## Filosofía visual
SIGMA-TE no debe parecer:
- una app infantil
- una landing page de marketing
- una red social
- un dashboard inflado de gráficos innecesarios

SIGMA-TE debe sentirse:
- como herramienta operativa real
- como sistema técnico empresarial
- como software usado diariamente
- como plataforma seria de gestión

## Flujo de trabajo
-> Identificar la pantalla.
-> Identificar la tarea principal.
-> Aplicar reglas visuales.
-> Aplicar tokens de diseño.
-> Aplicar estructura de layout.
-> Aplicar componentes permitidos.
-> Revisar accesibilidad.
-> Revisar responsive.
-> Verificar consistencia visual.

## Reglas de color
- Priorizar fondos oscuros.
- Usar alto contraste controlado.
- Evitar colores extremadamente saturados.
- Los colores deben comunicar estado, no decoración.

## Reglas de experiencia
- El usuario debe entender rápidamente qué hacer.
- La interfaz debe reducir carga mental.
- Los estados importantes deben verse claramente.
- El diseño debe priorizar legibilidad sobre decoración.

## Reglas de generación IA
SI una IA genera una interfaz,
ENTONCES debe respetar:
- tokens visuales
- layout definido
- componentes permitidos
- reglas responsive
- reglas de accesibilidad
- guardrails visuales

## Checklist interno
- [ ] El diseño respeta identidad SIGMA-TE.
- [ ] Los colores siguen tokens definidos.
- [ ] La pantalla tiene propósito claro.
- [ ] El layout es consistente.
- [ ] Los componentes son reutilizables.
- [ ] La interfaz es usable en desktop y web.
- [ ] No existen elementos visuales innecesarios.

## Archivos de referencia
- references/design-tokens.md
- references/visual-style.md
- references/layout-system.md
- references/components.md
- references/interaction-rules.md
- references/accessibility-rules.md
- references/responsive-rules.md
- references/visual-guardrails.md
- references/design-principles.md
- references/stitch-brief.md