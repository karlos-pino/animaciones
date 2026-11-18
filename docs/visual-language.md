# Lenguaje visual

El lienzo lógico mide 1920×1080. Usa un margen seguro de 80 px a izquierda y derecha y 64 px arriba y abajo. Alinea bloques con una cuadrícula de 8 px y deja al menos 24 px entre regiones semánticas. Compón primero para 960×540.

| Rol                | Token           | Uso                                             |
| ------------------ | --------------- | ----------------------------------------------- |
| Fondo y superficie | paper / surface | Papel cálido y paneles claros.                  |
| Texto y contraste  | ink / muted     | Jerarquía de lectura.                           |
| Disponible         | blue            | Puntos activos con forma según nivel.           |
| Elegible           | teal            | Punto con doble anillo y etiqueta de resultado. |
| Excluido           | rust            | Marca de exclusión y cambio de opacidad.        |
| Límites            | line / grid     | Geografía esquemática y divisiones.             |

Inter Variable proviene de una dependencia local. Jerarquía lógica de 68 px para títulos, 44 px para secciones, 32 px para cuerpo y 26 px como mínimo para etiquetas. Los numerales principales pueden llegar a 120 px. Sitúa las leyendas junto a su diagrama y conserva la posición de las entidades durante un filtro.
