export const colors = {
  paper: '#f1f0e8',
  surface: '#fbfaf3',
  ink: '#172e2a',
  muted: '#4b625c',
  white: '#ffffff',
  dark: '#143e35',
  blue: '#245d70',
  teal: '#006952',
  mint: '#afeccb',
  rust: '#9d382c',
  inactive: '#526865',
  line: '#aabbb1',
  grid: '#d6e0d6',
  map: '#e3ece1',
  mapAlt: '#d8e6d8',
} as const;

export const type = {
  family: 'Inter Variable',
  title: 68,
  heading: 44,
  body: 32,
  small: 26,
  metric: 120,
  regular: 450,
  medium: 550,
  strong: 720,
} as const;

export const canvas = { width: 1920, height: 1080, safeX: 80, safeY: 64 } as const;
export const spacing = { unit: 8, gap: 24, panel: 40, radius: 24 } as const;
export const opacity = { dimmed: 0.34, hidden: 0, visible: 1 } as const;
export const motion = {
  reveal: 0.4,
  emphasis: 0.42,
  filter: 0.65,
  transition: 0.38,
  curve: { entrance: 'easeOutCubic', change: 'easeInOutCubic' },
} as const;
