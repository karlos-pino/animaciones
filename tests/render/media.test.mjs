import { describe, expect, it } from 'vitest';
import { presets, verifyVideo } from '../../scripts/media.mjs';

const probe = () => ({
  streams: [
    {
      codec_type: 'video',
      codec_name: 'h264',
      pix_fmt: 'yuv420p',
      width: 960,
      height: 540,
      avg_frame_rate: '30/1',
      r_frame_rate: '30/1',
      nb_frames: '600',
    },
  ],
  format: { duration: '20.000000', format_name: 'mov,mp4,m4a,3gp,3g2,mj2', size: '123' },
});

describe('validación de exportación', () => {
  it('acepta el preview esperado', () => {
    expect(verifyVideo(probe(), presets.preview, 20)).toMatchObject({
      width: 960,
      height: 540,
      fps: 30,
      frames: 600,
      seconds: 20,
      audio: false,
    });
  });
  it('rechaza streams de audio, un fps distinto y un fotograma faltante', () => {
    const audio = probe();
    audio.streams.push({ codec_type: 'audio' });
    expect(() => verifyVideo(audio, presets.preview, 20)).toThrow();
    const fps = probe();
    fps.streams[0].avg_frame_rate = '60/1';
    expect(() => verifyVideo(fps, presets.preview, 20)).toThrow();
    const frames = probe();
    frames.streams[0].nb_frames = '599';
    expect(() => verifyVideo(frames, presets.preview, 20)).toThrow();
  });
});
