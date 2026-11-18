# Flujo de producción

1. Crea una carpeta bajo `productions/`. Describe objetivo, audiencia, fuentes, salida y restricciones en `brief.yaml`. Usa [el ejemplo validado](../tests/unit/fixtures/brief.yaml) como referencia.
2. Registra hechos, supuestos y simplificaciones en `facts.md`. Vincula las fuentes con los IDs del brief y confirma reglas y casos frontera.
3. Escribe `storyboard.yaml` con estados encadenados, transiciones, duración y checkpoints. Usa [el contrato](../packages/validation/src/index.ts) y coloca los checkpoints sobre estados observables.
4. Crea funciones puras y datos de prueba en `model/`; añade pruebas en `tests/`. Si hay datos sintéticos, fija y documenta la semilla.
5. Implementa escenas con los paquetes comunes y añade el proyecto al arreglo `project` de `apps/motion-studio/vite.config.ts`. Carga la tipografía local antes de que Motion Canvas construya la escena.
6. Para un proyecto exportable, sigue el patrón de `capture-project.ts`. Registra su proyecto y cronograma en `capture.ts` y su checkpoint de póster en el módulo de historia. Asegúrate de generar la alternativa textual en la carpeta de producción.
7. Reproduce en el editor, inspecciona los checkpoints a 960×540 y aplica la [puerta de calidad](quality-gate.md). Para una nueva producción, añade sus pruebas visuales y revisa las referencias antes de incluirlas en Git.
8. Ejecuta lint, TypeScript, Vitest y las pruebas visuales. Exporta los medios, ejecuta ffprobe con el script de validación y crea el manifiesto de release.

## Render determinista

El adaptador arranca Vite en loopback, usa Chromium fijado por Playwright y ejecuta el `Renderer` de Motion Canvas con un exportador de PNG. El proceso Node verifica el orden de los fotogramas y entrega la secuencia a FFmpeg por stdin. Los checkpoints usan el mismo adaptador y el cronograma del storyboard. La ruta `capture.html` sirve a la automatización durante desarrollo. Los comandos de exportación asumen un proyecto mudo y una sola producción por invocación.

El editor también permite producir una secuencia PNG desde su panel Video Settings. Usa lienzo 1920×1080 y escala 0,5 a 30 FPS para preview, o 1 a 60 FPS para el master. El botón de cámara guarda el cuadro del tiempo seleccionado. El adaptador automatizado documentado en el README es la ruta verificada para los MP4 y sus metadatos.

## Ampliaciones

Manim, Three.js/React Three Fiber, Blender, Remotion, Rive y catálogo web están en el backlog. Cuando aparezca una necesidad concreta, añade un ADR a `docs/adr/` con caso de uso, alternativas, versión, licencia vigente, costo de mantenimiento y estrategia de pruebas antes de incorporar el motor.
