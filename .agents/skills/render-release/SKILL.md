---
name: render-release
description: Exporta animaciones aprobadas y valida dimensiones, FPS, duración y streams.
---

# Entradas

Producción revisada, presets y herramientas disponibles.

# Pasos

Ejecuta los scripts del README. Valida cada video con ffprobe y revisa el póster. Genera el manifiesto con revisión Git, versiones, fuentes, licencias y resultados.

# Salidas

Medios, póster, checkpoints y manifiesto en dist/.

# Criterios de rechazo

Rechaza una publicación cuando falten verificaciones o los streams difieran del preset.

# Referencia

[Especificación de medios](../../../docs/export-specs.md)
