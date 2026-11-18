interface StudioProduction {
  duration: number;
  checkpoints: { id: string; seconds: number }[];
  posterId: string;
}

interface StudioCapture {
  fps: number;
  scale: number;
  frames: number[] | null;
}

interface Window {
  studioProduction: StudioProduction;
  captureStudio: (settings: StudioCapture) => Promise<void>;
  studioFrame: (frame: number, png: string) => Promise<void>;
}
