# Puerta de calidad editorial

- Exactitud: contrastar cada regla, el orden y los recuentos con los hechos, el modelo y los tests.
- Claridad: comprobar que objetivo, solicitud, exclusiones y resultado se entienden al presentar los fotogramas sin narración.
- Ritmo: reproducir a escala real y comprobar que hay tiempo para leer cada regla y observar los cambios.
- Continuidad: verificar que cada punto mantiene su posición al excluir otros y que el contador cambia al cerrar la regla.
- Composición: comprobar márgenes seguros, ausencia de texto recortado, separaciones y contraste a 960×540.
- Estilo: comparar las capturas con las referencias y revisar cualquier diferencia antes de actualizarlas.
- Accesibilidad: usar forma, diagonal y anillo junto con color. Entregar alternativa textual y captions cuando haya audio. Proporcionar movimiento reducido en futuras piezas web interactivas.
- Reproducibilidad: instalar con lockfile, usar Chromium fijado por Playwright y fuente local, repetir capturas y consultar ffprobe al exportar.

La comparación visual verifica el lienzo renderizado. El reporte HTML conserva las capturas reales y Playwright genera las diferencias cuando un fotograma sale de la tolerancia.
