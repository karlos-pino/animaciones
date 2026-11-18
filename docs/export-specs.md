# Especificación de exportación

| Entrega     | Dimensiones | FPS | Formato                         |
| ----------- | ----------- | --- | ------------------------------- |
| Preview     | 960×540     | 30  | MP4 H.264 con compresión CRF 24 |
| Master      | 1920×1080   | 60  | MP4 H.264 CRF 17                |
| Póster      | 1920×1080   | —   | PNG sRGB del resultado          |
| Checkpoints | 960×540     | —   | PNG sRGB con nombre semántico   |

Los videos se componen a 1920×1080 lógico. El preview aplica escala 0,5. El piloto se entrega con un stream de video y sin audio. Verifica cantidad de fotogramas, FPS, dimensiones, códec, pixel format y duración con ffprobe. Usa +faststart para MP4. Conserva los presets y la revisión Git en el manifiesto.
