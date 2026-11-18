# Ejercicio breve de storyboard

## Solicitud

Explica a un operador nuevo cómo una inspección pasa de pendiente a registrada cuando guarda un acta. La solicitud es la fuente de esta regla de ejemplo.

## Brief producido con animation-brief

- Objetivo: reconocer el cambio de estado al guardar un acta.
- Audiencia: operador nuevo.
- Hecho F1: guardar un acta cambia la inspección de pendiente a registrada.
- Salida: una escena muda, 16:9, con un estado visible al inicio y al cierre.
- Restricción: el caso de ejemplo describe un guardado exitoso y deja fuera fallos de persistencia.

## Storyboard producido con storyboard

| ID      | Punto de aprendizaje | Entidades         | Estado inicial       | Acción            | Estado final          | Duración | Texto                                 | Checkpoint     | Supuesto         |
| ------- | -------------------- | ----------------- | -------------------- | ----------------- | --------------------- | -------- | ------------------------------------- | -------------- | ---------------- |
| guardar | Reconocer F1         | Acta e inspección | Inspección pendiente | Se guarda el acta | Inspección registrada | 4 s      | Acta guardada · Inspección registrada | guardado a 3 s | Guardado exitoso |

El estado final coincide con F1. El checkpoint pertenece al intervalo de la escena y deja un segundo de lectura adicional.
