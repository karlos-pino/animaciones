# Hechos del piloto

La especificación funcional del encargo es la fuente de F1–F5.

| Hecho | Comprobación                                                                                          |
| ----- | ----------------------------------------------------------------------------------------------------- |
| F1    | 50 recursos sintéticos. 12 inactivos y 38 activos.                                                    |
| F2    | La disponibilidad se define como `active === true`.                                                   |
| F3    | La solicitud especifica `level: intermediate`.                                                        |
| F4    | Entre los activos, 14 son básicos, 16 intermedios y 8 avanzados. El criterio exige igualdad de nivel. |
| F5    | 16 recursos activos e intermedios. El territorio se registra como atributo informativo.               |

Cada recurso tiene ID, coordenadas normalizadas, bandera de actividad, nivel y territorio. El conjunto usa una semilla fija y una malla perturbada. Las líneas del mapa y sus ubicaciones son esquemáticas. Los recursos inactivos incluyen ejemplos de los tres niveles para detectar una aplicación incorrecta del segundo criterio.

El resultado expresa elegibilidad para estos dos filtros. El piloto termina antes de seleccionar o asignar un recurso individual.
