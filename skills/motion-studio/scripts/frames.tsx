// Device frames for real product UI. Copy to src/lib/frames.tsx.
// Both are static boxes sized in their own pixels: put them in the camera world and let camera.ts move
// and scale them. Screenshots, recordings or rebuilt UI go in as children, laid out at native size.
import type { CSSProperties, ReactNode } from 'react';

// A generic light browser window. `height` includes the chrome; children fill what's left below it.
export const BrowserWindow = ({
  width,
  height,
  chrome = 110,
  radius = 10,
  shadow = '0 28px 70px rgba(0,0,0,.16), 0 2px 8px rgba(0,0,0,.06)',
  title,
  url,
  favicon,
  fontFamily = 'system-ui, sans-serif',
  style,
  children,
}: {
  width: number;
  height: number;
  chrome?: number;
  radius?: number;
  shadow?: string;
  title: string;
  url: string;
  favicon?: ReactNode;
  fontFamily?: string;
  style?: CSSProperties;
  children: ReactNode;
}) => {
  const tabs = chrome * 0.42;
  const bar = chrome - tabs;
  const text = chrome * 0.125;
  return (
    <div style={{ position: 'absolute', width, height, borderRadius: radius, overflow: 'hidden', background: '#fff', boxShadow: shadow, fontFamily, ...style }}>
      <div style={{ height: tabs, background: '#E4E7EB', display: 'flex', alignItems: 'flex-end', paddingLeft: chrome * 0.16 }}>
        <div style={{ display: 'flex', gap: chrome * 0.075, alignSelf: 'center', marginRight: chrome * 0.2 }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <div key={c} style={{ width: chrome * 0.11, height: chrome * 0.11, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={{ height: tabs * 0.8, width: chrome * 2.2, padding: `0 ${chrome * 0.12}px`, background: '#fff', borderRadius: `${chrome * 0.08}px ${chrome * 0.08}px 0 0`, display: 'flex', alignItems: 'center', gap: chrome * 0.07, fontSize: text, color: '#3c4043' }}>
          {favicon}
          <span style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{title}</span>
        </div>
      </div>
      <div style={{ height: bar, background: '#fff', borderBottom: '1px solid #E4E7EB', boxSizing: 'border-box', display: 'flex', alignItems: 'center', padding: `0 ${chrome * 0.16}px` }}>
        <div style={{ flex: 1, height: bar * 0.6, borderRadius: bar * 0.3, background: '#F1F3F4', display: 'flex', alignItems: 'center', padding: `0 ${chrome * 0.16}px`, fontSize: text, color: '#3c4043' }}>{url}</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: chrome, bottom: 0, overflow: 'hidden' }}>{children}</div>
    </div>
  );
};

// A flat, front-on phone. `width` and `height` are the screen (390 x 844 for a current iPhone in CSS px);
// the bezel sits outside it, so the screen's top-left is the frame's origin, and children use app points.
export const PhoneFrame = ({
  width = 390,
  height = 844,
  bezel = 8,
  radius = 47,
  color = '#141214',
  shadow,
  style,
  children,
}: {
  width?: number;
  height?: number;
  bezel?: number;
  radius?: number;
  color?: string;
  shadow?: string;
  style?: CSSProperties;
  children: ReactNode;
}) => (
  <div style={{ position: 'absolute', width, height, ...style }}>
    <div style={{ position: 'absolute', left: -bezel, top: -bezel, width: width + 2 * bezel, height: height + 2 * bezel, borderRadius: radius, background: color, boxShadow: shadow }} />
    <div style={{ position: 'absolute', width, height, borderRadius: radius - bezel, overflow: 'hidden', background: '#fff' }}>{children}</div>
  </div>
);
