# Lenguaje de movimiento

| Categoría   | Propósito                                            | Duración típica |
| ----------- | ---------------------------------------------------- | --------------- |
| Funcional   | Demostrar una exclusión o un cambio de estado.       | 0,35–0,75 s     |
| Orientativo | Desplazar el foco o presentar la siguiente regla.    | 0,25–0,55 s     |
| Expresivo   | Subrayar el cierre con un único énfasis subordinado. | 0,3–0,65 s      |

Usa `easeOutCubic` para entradas y `easeInOutCubic` para cambios de estado. Reserva lineal para progress que represente tiempo. Haz visible el motivo de exclusión antes de desvanecer. Conserva la ancla del elemento y actualiza el contador al terminar la transición. Deja al menos un segundo para una etiqueta corta y amplía la pausa según lectura. Revisa el ritmo a velocidad real.

Fuentes de orientación: [Material Design, duración y easing](https://m1.material.io/motion/duration-easing.html) y [Apple HIG, Motion](https://developer.apple.com/design/human-interface-guidelines/motion).
