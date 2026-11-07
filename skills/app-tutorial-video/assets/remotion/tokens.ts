export const FPS = 24;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Per app: files under public/, the app name shown on push notifications, and the closing line.
export const brand = {
  logo: 'brand/logo.png',
  icon: 'brand/icon-192.png',
  appName: 'If It\'s Paper',
  tagline: 'Your schedule, in your pocket.',
} as const;

// Accent = the app's header/primary color; accentWipe and accentGlow are lighter tints of it.
export const color = {
  stage: '#fbf9f5',
  oat: '#efeee5',
  ink: '#0c0c0a',
  inkSoft: '#2b2b28',
  inkDim: '#70706d',
  accent: '#3d4f47',
  accentWipe: '#b8c6be',
  accentGlow: '#dce4df',
} as const;

export const font = {
  serif: "'EB Garamond', Georgia, serif",
  sans: "'Quicksand', system-ui, sans-serif",
} as const;

// Phone screen in CSS px of the captured viewport; K maps it to 880px tall at rest.
export const phone = {
  w: 390,
  h: 844,
  bezel: 12,
  radius: 54,
  k: 880 / 844,
  fx: 660,
  fy: 540,
} as const;

export const column = { x: 1150, w: 640 } as const;

// Desktop browser window in CSS px of the captured viewport, shown at 1:1 on the wide shot.
export const win = { w: 1418, h: 790, bar: 36, x: 251, top: 66 } as const;

export const band = { top: 935 } as const;
