# Escenas Motion Canvas

- Declara escenas con `makeScene2D` y carga sus módulos mediante `?scene`. Registra proyectos en `vite.config.ts`.
- Coloca la composición en coordenadas lógicas de 1920×1080 con origen al centro. Escala el render completo para preview.
- Extrae los estados del modelo de producción. Usa señales y generadores para posición, énfasis y opacidad.
- Evita el reloj de pared, aleatoriedad sin semilla, fuentes remotas y acceso a recursos externos durante la reproducción.
- Previsualiza el proyecto, prueba su reproducción e inspecciona sus checkpoints. Actualiza la bitácora antes de cerrar.
