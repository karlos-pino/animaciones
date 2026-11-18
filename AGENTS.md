# Mission

Crear animaciones explicativas precisas, comprensibles y reproducibles mediante código editable.

# Priorities

Exactitud > claridad > estética > complejidad.

# Required workflow

Brief → validación de hechos → storyboard → modelo de datos y reglas → implementación → preview → revisión → pruebas → exportación.

# Hard constraints

- Nunca inventes reglas de negocio ni relaciones causales.
- Deriva resultados y contadores del modelo. Reutiliza componentes antes de crear otros.
- Justifica motores nuevos con un ADR. Usa fuentes locales y datos sintéticos deterministas.
- Conserva el trabajo existente. Registra supuestos, límites, comandos reales y evidencias.
- Cierra una tarea cuando su criterio de aceptación esté comprobado.

# Architecture

`apps/motion-studio` aloja proyectos Motion Canvas. `packages/` contiene tokens, componentes, movimiento, geometría y validación. `productions/` conserva fuentes, datos y escenas. `dist/` contiene exportaciones generadas.

Desde la raíz, ejecuta `pnpm dev:motion` para abrir el editor y `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm test:visual` para validar. Usa `pnpm checkpoints -- service-resource-selection` para revisar el piloto. Consulta los comandos de render y requisitos en [README.md](README.md). Registra cambios de fase en [docs/implementation-log.md](docs/implementation-log.md).
