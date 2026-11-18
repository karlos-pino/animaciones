# Bitácora de implementación

## Fase 1 — Diagnóstico y decisiones técnicas · 2026-11-17 · COMPLETADA

- Archivos: `docs/implementation-log.md` y `docs/technology-decisions.md`.
- Comandos: `Get-ChildItem -Force`, `rg --files --hidden`, `git status --short --branch`, `git rev-parse --show-toplevel`, `Get-Command`, consultas de versión y metadatos npm por Node.
- Resultado: Git 2.53.0.windows.3 encontró un repositorio existente sin commits, en `master`. El único elemento era `.git`. Se conserva el repositorio. Windows NT 10.0.26300.0, Node 24.15.0, npm 11.12.1, Corepack 0.34.6, pnpm 11.25.0 y Python 3.15.0b2. Chrome 157.0.8103.39 y Edge 157.0.4341.42 están instalados fuera de PATH. `uv`, `ffmpeg` y `ffprobe` no estaban en PATH.
- Incidencias: el shell restringido devolvió error DNS para registry.npmjs.org. La consulta de acceso elevada dio HTTP 200 y la consulta siguiente devolvió los metadatos de los paquetes. FFmpeg es necesario antes de codificar, uv es opcional.
- Evidencia: matriz y referencias en [decisiones tecnológicas](technology-decisions.md). Validación de dependencias en ejecución se continúa en la fase 2.

## Fase 2 — Workspace y preview mínimo · 2026-11-17 · COMPLETADA

- Archivos: configuración raíz de pnpm, TypeScript, ESLint, Prettier, editor, README, lockfile y proyecto `apps/motion-studio/src/smoke.ts`.
- Comandos: `pnpm install --store-dir .tools/pnpm-store --fetch-retries=0`, `pnpm dev:motion`, `pnpm typecheck`, `pnpm lint`, `pnpm exec playwright install chromium` y `node .tools/verify-smoke.mjs`.
- Resultado: pnpm instaló 223 paquetes. Vite arrancó en loopback y Chromium 159.0.8154.6 abrió el editor real. Su botón Play cambió píxeles del lienzo, con cero errores de página.
- Evidencia: `dist/evidence/phase-02-smoke.png`.
- Incidencias: el plugin CommonJS requirió `createRequire` para configurar Vite en ESM. En el ensayo se arrancó Vite con cwd de la app para resolver imports virtuales. La política de red del sandbox bloqueó incluso loopback en Chromium; la prueba se ejecutó con elevación. Playwright reintentó sus espejos y descargó Chromium. ESLint 9, Vite CJS y mathjax-full generan avisos de mantenimiento.
- Herramientas de medios: Gyan directo falló por DNS. `npm pack` y `tar.exe` extrajeron binarios locales de `@ffmpeg-installer/win32-x64@4.1.0` y `@ffprobe-installer/win32-x64@5.1.0`. Ejecutaron `-version` correctamente: N-92722-gf22fcd4483 y 2023-02-13-git-2296078397, respectivamente. Queda pendiente comprobar codificación y lectura.

## Fase 3 — Instrucciones y skills · 2026-11-17 · COMPLETADA

- Archivos: `AGENTS.md` raíz y de app, seis `.agents/skills/*/SKILL.md` y `docs/skill-workflow-example.md`.
- Comandos: `quick_validate.py` sobre las seis carpetas y `node .tools/probe-skills.mjs` para consultar `codex app-server` vía `skills/list` con `forceReload: true`.
- Resultado: seis frontmatters válidos y seis skills activas con alcance `repo`. En este chat Codex leyó los archivos y ejecutó el ejercicio de brief a storyboard. La consulta prueba descubrimiento, mientras el ejercicio prueba uso explícito del procedimiento.
- Evidencia: `dist/evidence/phase-03-skills.json` y [ejercicio](skill-workflow-example.md).
- Incidencias: la ACL de `.agents` y el estado de Codex impidieron usar el sandbox para las cinco últimas escrituras y el descubrimiento. Se resolvió con la ejecución elevada de las operaciones acotadas.
- Referencias: [OpenAI AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) y [skills](https://learn.chatgpt.com/docs/build-skills).
- Comprobación adicional al cierre: `codex debug prompt-input` encontró las instrucciones raíz desde ambos directorios, las instrucciones de la app desde su directorio y las skills desde la raíz. Evidencia resumida en `dist/evidence/phase-03-agent-instructions.json`.

## Fase 4 — Lenguaje visual y contratos · 2026-11-17 · COMPLETADA

- Archivos: cinco guías de estilo y exactitud, `packages/design-tokens`, `packages/validation` y ejemplos en `tests/unit/fixtures`.
- Comandos: `pnpm install --store-dir .tools/pnpm-store --cache-dir .tools/pnpm-cache --fetch-retries=0 --no-frozen-lockfile`, `pnpm test`, `pnpm lint` y `pnpm typecheck`.
- Resultado: cinco casos de contrato aprobados, con un flujo positivo y cuatro rechazos. Lint y TypeScript aprobaron.
- Incidencias: pnpm no pudo comprobar offline la política del lockfile porque faltaban metadatos de registry. La repetición con acceso a npm completó 270 comprobaciones de entradas. Se corrigió un paréntesis de una aserción y se repitieron los checks.
- Evidencia: `tests/unit/contracts.test.ts` y `tests/unit/fixtures/`. La legibilidad queda para la revisión de la galería y del piloto.

## Fase 5 — Componentes, geometría y movimiento · 2026-11-17 · COMPLETADA

- Archivos: `packages/diagram-components`, `packages/motion-primitives`, `packages/geometry`, proyecto `gallery`, carga de Inter local y pruebas de geometría.
- Comandos: actualización de lockfile, `pnpm typecheck`, `pnpm test` y `node .tools/verify-gallery.mjs` con Chromium.
- Resultado: nueve pruebas unitarias aprobadas. Se capturaron y abrieron las dos escenas desde el editor real. La primera mostró 11 componentes con sus muestras. La segunda mostró los ocho patrones en sus estados finales.
- Evidencia: `dist/evidence/phase-05-primitives.png` y `dist/evidence/phase-05-patterns.png`.
- Incidencias: el cache npm offline aún carecía de metadatos de variantes opcionales. La comprobación online aprobó el lockfile.

## Fase 6 — Piloto de selección de recursos · 2026-11-17 · COMPLETADA

- Archivos: `productions/service-resource-selection/`, proyecto Motion Canvas, exportador PNG y `scripts/checkpoints.mjs`.
- Comandos: `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm checkpoints -- service-resource-selection` y `node .tools/verify-pilot.mjs`.
- Resultado: 12 pruebas aprobadas. El modelo confirmó 50 → 38 → 16 y cuatro intermedios inactivos excluidos. Se abrieron siete capturas en PNG de 960×540 y se probó reproducción en el editor, sin errores en la ejecución final.
- Evidencias: `dist/service-resource-selection/checkpoints/`, `dist/service-resource-selection/checkpoints.json` y `dist/evidence/phase-06-pilot-editor.png`.
- Incidencias y decisiones: se amplió la separación de leyenda y se desplazó la solicitud a la izquierda para respetar la zona segura. Los checkpoints de inicio se colocaron durante el marcado de exclusiones. Se añadió el editor a la optimización inicial de Vite tras un timeout por recarga. La fuente es un proyecto mudo. Los MP4 se verifican en la fase 8.

## Fase 7 — Calidad y accesibilidad · 2026-11-17 · COMPLETADA

- Archivos: `playwright.config.ts`, prueba visual, siete PNG de referencia, prueba de layout, medición de etiquetas, checklist y alternativa textual.
- Comandos: `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm test:visual --update-snapshots`, `pnpm test:visual` y `pnpm checkpoints -- service-resource-selection`.
- Resultado: 15 pruebas de Vitest y dos de Playwright. Se inspeccionaron los siete checkpoints a 960×540. Los marcos no se superponen, los marcadores tienen contraste y los píxeles demuestran identidad y posición constantes, 12 y 22 marcas de exclusión y 16 puntos finales.
- Incidencias: el primer ensayo de separación mínima medía 48,52 px lógicos. Se redujo la perturbación de la malla y se escalonaron las filas. Otra prueba ajustó el muestreo para reconocer contornos huecos. Para examinar el movimiento en el editor se verifica el cambio de píxeles y el rombo final.
- Evidencia: `tests/visual/__snapshots__/`, `playwright-report/index.html` y PNG en `dist/service-resource-selection/checkpoints/`. La pieza es un video mudo. La alternativa textual está incluida y las variantes de movimiento reducido quedan para futuras piezas interactivas.

## Fase 8 — Render y medios · 2026-11-17 · COMPLETADA

- Archivos: scripts de render, inspección y manifiesto. Salida MP4, póster, checkpoints y alternativa textual en `dist/service-resource-selection/`.
- Comandos: `pnpm render:preview -- service-resource-selection`, `pnpm render:master -- service-resource-selection`, `pnpm check:media` para ambos MP4, `pnpm release:manifest -- service-resource-selection` y prueba de decodificación con FFmpeg.
- Resultado de ffprobe: preview 960×540, 30 FPS, 600 cuadros, 186.941 bytes. Master 1920×1080, 60 FPS, 1.200 cuadros, 810.122 bytes. Ambos H.264 yuv420p, 20 s y un stream de video. Se decodificó todo el master y se examinó una imagen de la segunda exclusión extraída del preview, además del póster PNG.
- Evidencia: `dist/service-resource-selection/manifest.json`, `dist/evidence/phase-08-decoded-preview.png` y entregables en la carpeta de distribución. La primera generación del manifiesto tenía `commit: null` porque el repositorio aún carecía de HEAD.
- Decisión: el adaptador entrega el PNG de Motion Canvas a FFmpeg por stdin. El manifiesto registra herramientas, fuentes y sus hashes, licencias de assets y resultados de ffprobe. Se conserva fuente y snapshots en Git. Los medios generados quedan en `dist/`.

## Fase 9 — CI y documentación operativa · 2026-11-17 · COMPLETADA

- **Archivos** Workflows `quality.yml` y `checkpoints.yml`, guía de producción, README, backlog de ADR, reglas de formato y texto plano.
- **Comandos** `actionlint -no-color` para ambos workflows. En `git clone --local --no-hardlinks` de `55abe99`, instalación con lockfile, formato, lint, typecheck, Vitest, Playwright, checkpoints, render de preview y master, ffprobe para ambos y manifiesto.
- **Resultado** actionlint 1.7.12 aprobó ambos archivos. La copia limpia reinstaló 223 paquetes con integridad de lockfile, aprobó 17 pruebas de Vitest y dos de Playwright, reprodujo ambos videos y mantuvo limpio el árbol Git. Los 12 archivos de distribución coincidieron byte a byte por SHA-256. La revisión que documenta este resultado solo actualiza documentación.
- **Evidencias** `dist/evidence/phase-09-actionlint.txt`, `dist/evidence/phase-09-clean-pipeline.txt` y el manifiesto final de distribución.
- **CI en GitHub** Se publicó la revisión `5f765c6` en `main` con `git push origin HEAD:refs/heads/main`. Calidad aprobó en Ubuntu 24.04 la instalación con lockfile, el formato, lint, TypeScript y Vitest. [Ejecución de Calidad](https://github.com/karlos-pino/animaciones/actions/runs/44212652882).
- **Capturas en GitHub** Se ejecutó `checkpoints.yml` mediante `workflow_dispatch`. Playwright, la generación de checkpoints y la subida del artefacto `checkpoints-y-reporte` aprobaron en Windows Server 2025. El resumen de ambos workflows quedó en `dist/evidence/phase-09-github-actions.json`. [Ejecución y artefacto de Capturas del piloto](https://github.com/karlos-pino/animaciones/actions/runs/44212737851).
- **Referencias** [Sintaxis de GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax), [imágenes de runners](https://github.com/actions/runner-images/blob/main/README.md) y [actionlint](https://github.com/rhysd/actionlint/releases/tag/v1.7.12).

## Fase 10 — Backlog

Manim, Three.js/React Three Fiber, Blender, Remotion, Rive y catálogo web quedan pendientes de un caso de uso y un ADR, según el plan.
