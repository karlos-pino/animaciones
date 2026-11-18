# Explainer Studio

Estudio reutilizable de animación explicativa con Motion Canvas y TypeScript. El piloto **Selección de recursos de servicio** enseña 50 registrados → 38 disponibles → 16 elegibles en 20 segundos.

## Arranque

Requisitos de desarrollo: Git, Node.js 24.15.0 y pnpm 11.25.0. El editor funciona en un navegador local. Los tests visuales y el render usan Chromium de Playwright. Para codificar y validar video, instala FFmpeg con `libx264` y ffprobe. Usa `PATH` o proporciona `FFMPEG_PATH` y `FFPROBE_PATH` con rutas absolutas.

```sh
pnpm install --frozen-lockfile
pnpm dev:motion
```

Abre la URL que imprime Vite, normalmente `http://127.0.0.1:9000/`. Selecciona **service-resource-selection** para el piloto, **gallery** para la biblioteca o **smoke** para la prueba mínima. El piloto también abre en `http://127.0.0.1:9000/src/service-resource-selection`.

Si necesitas preparar pnpm, instala la versión fijada mediante Corepack o `npm install -g pnpm@11.25.0`. Para la automatización visual:

```sh
pnpm exec playwright install chromium
```

En Linux, usa `pnpm exec playwright install --with-deps chromium` cuando falten bibliotecas del navegador. En Windows, el estudio admite el Chromium instalado por Playwright en la ubicación habitual, en `.tools/browsers` o donde indique `PLAYWRIGHT_BROWSERS_PATH`. Para FFmpeg, usa una distribución [listada por el proyecto FFmpeg](https://ffmpeg.org/download.html) y confirma `ffmpeg -version` y `ffprobe -version`.

## Validación y entrega

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:visual
pnpm checkpoints -- service-resource-selection
pnpm render:preview -- service-resource-selection
pnpm render:master -- service-resource-selection
pnpm check:media -- dist/service-resource-selection/preview.mp4
pnpm check:media -- dist/service-resource-selection/master.mp4
pnpm release:manifest -- service-resource-selection
```

Los videos de 20 segundos, el póster, los checkpoints, la alternativa textual y el manifiesto quedan en `dist/service-resource-selection/`. La carpeta `playwright-report/` contiene el reporte visual. El master y el preview tienen una pista de video H.264 y carecen de audio.

## Estructura

- `apps/motion-studio/` contiene el editor, la galería y los proyectos Motion Canvas.
- `packages/` contiene tokens, componentes, movimiento, geometría y validación.
- `productions/` contiene hechos, brief, storyboard, modelo, escenas y pruebas por producción.
- `scripts/` contiene la captura, exportación y verificación de medios.
- `tests/` contiene pruebas transversales y referencias PNG aprobadas.
- `docs/` contiene el flujo, las decisiones y la bitácora.

Para agregar una producción, sigue el [flujo operativo](docs/production-workflow.md). Consulta los [presets](docs/export-specs.md), la [puerta de calidad](docs/quality-gate.md) y la [bitácora](docs/implementation-log.md).

## Diagnóstico

- Si Vite informa que el puerto está ocupado, elige otro con `pnpm --filter @studio/motion-studio dev --port 9010` y usa la URL resultante. Las pruebas visuales utilizan 9017 y el render toma un puerto libre.
- Si el entorno gestionado bloquea npm o Chromium en loopback, ejecuta esos pasos donde la política admita el registro público y el servidor local. Repite la comprobación y conserva la salida del error inicial.
- Si Playwright no encuentra Chromium, ejecuta su instalación con el mismo `PLAYWRIGHT_BROWSERS_PATH` que usas para correr las pruebas. Revisa las diferencias de snapshots antes de actualizar con `pnpm test:visual --update-snapshots`. Las referencias se aprobaron en Windows.
- Si FFmpeg no reconoce `libx264` o falta ffprobe, ajusta las rutas a una distribución que los incluya. El estudio dispone de selección automática para los binarios locales usados en la bitácora de Windows.

El workflow de calidad instala con lockfile y ejecuta estilo, lint, TypeScript y Vitest. El workflow manual de checkpoints ejecuta Chromium en Windows y agrega capturas y reporte como artefactos.
