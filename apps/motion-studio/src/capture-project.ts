import { MetaField, type ExporterClass, type ProjectSettings } from '@motion-canvas/core';
import selection from './service-resource-selection';

const transport: ExporterClass = {
  id: 'studio:png',
  displayName: 'Transporte PNG',
  meta: () => new MetaField('Transporte', null),
  async create(_project, settings) {
    const frames = settings.exporter.options as number[] | null;
    const selected = frames ? new Set(frames) : null;
    return {
      async handleFrame(canvas, frame, _sceneFrame, _sceneName, signal) {
        if (!signal.aborted && (!selected || selected.has(frame))) {
          const encoded = canvas.toDataURL('image/png').split(',')[1];
          if (!encoded) throw new Error(`Fotograma ${frame} vacío`);
          await window.studioFrame(frame, encoded);
        }
      },
    };
  },
};

export default {
  ...selection,
  plugins: [{ name: 'studio:transport', exporters: () => [transport] }],
} satisfies ProjectSettings;
