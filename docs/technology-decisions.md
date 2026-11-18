# Decisiones tecnológicas

## Base del MVP

| Herramienta                           | Versión elegida            | Licencia                    | Función y decisión                                                                                                                                     |
| ------------------------------------- | -------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Node.js / pnpm                        | 24.15.0 / 11.25.0          | MIT / MIT                   | Runtime y workspace con lockfile.                                                                                                                      |
| Motion Canvas                         | 3.17.2                     | MIT                         | Escenas 2D, editor, reproducción y fotogramas.                                                                                                         |
| Vite                                  | 5.4.21                     | MIT                         | Última rama mayor que admite el peer del plugin Motion Canvas 3.17.2. Servidor local, ligado a loopback. Revisar avisos antes de actualizar o exponer. |
| TypeScript                            | 5.9.3                      | Apache-2.0                  | Análisis estricto y JSX de Motion Canvas.                                                                                                              |
| ESLint / typescript-eslint / Prettier | 9.39.1 / 8.48.0 / 3.7.4    | MIT                         | Estilo y análisis estático.                                                                                                                            |
| Vitest / Playwright                   | 2.1.9 / 1.65.1             | MIT / Apache-2.0            | Reglas puras y regresión visual en Chromium.                                                                                                           |
| Zod / YAML                            | 4.6.7 / 2.9.1              | MIT / ISC                   | Contratos editoriales estrictos sobre YAML.                                                                                                            |
| d3-scale                              | 4.0.3                      | ISC                         | Escalas de coordenadas normalizadas.                                                                                                                   |
| Inter Variable                        | 5.3.0                      | OFL-1.1                     | Fuente local empaquetada; incluye su licencia.                                                                                                         |
| FFmpeg / ffprobe                      | Ver evidencia de ejecución | LGPL-2.1+ o GPL según build | Codificación H.264 y verificación de streams. Los binarios se obtienen aparte.                                                                         |

Se priorizó compatibilidad de Motion Canvas sobre la versión mayor más reciente de Vite. El plugin declara `vite: 4.x || 5.x`. Node 24 satisface los requisitos publicados de Vite 5 y Playwright. Como el exportador de video de Motion Canvas no reemplaza la validación con ffprobe, la estrategia es capturar fotogramas del motor y codificarlos con FFmpeg.

## Opciones diferidas

SVG se usa cuando aporte geometría editable. GSAP se reserva para interacciones DOM en un paquete web. Python, uv, Manim, Three.js, React Three Fiber, Blender, Remotion y Rive quedan en el backlog. Una futura adopción requiere un ADR con versiones, licencia vigente, mantenimiento y estrategia de pruebas. Los términos comerciales de Remotion y Rive se evaluarán si existe un caso de adopción.

## Referencias consultadas el 17 de noviembre de 2026

- [Quickstart de Motion Canvas](https://motion-canvas.io/docs/quickstart/) y [peer del plugin](https://github.com/motion-canvas/motion-canvas/blob/main/packages/vite-plugin/package.json).
- [Render de Motion Canvas](https://motion-canvas.io/docs/rendering/) y [guía de Vite 5](https://v5.vite.dev/guide/).
- [Playwright](https://playwright.dev/docs/intro), [ffprobe](https://ffmpeg.org/ffprobe.html) y [licencias de FFmpeg](https://ffmpeg.org/legal.html).
