import { loadFont } from '@remotion/fonts';
import { Audio } from '@remotion/media';
import type { CSSProperties } from 'react';
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import captions from './captions-tutorial.json';
import film from './tutorial.json';
import { brand, color, column, font, FPS, HEIGHT, phone, WIDTH } from './tokens';

loadFont({ family: 'EB Garamond', url: staticFile('fonts/eb-garamond-latin-400-normal.woff2'), weight: '400' });
loadFont({ family: 'Quicksand', url: staticFile('fonts/quicksand-latin-500-normal.woff2'), weight: '500' });
loadFont({ family: 'Quicksand', url: staticFile('fonts/quicksand-latin-600-normal.woff2'), weight: '600' });

type Screen = (typeof film.screens)[number];
type Pose = { x: number; y: number; s: number };

const ease = Easing.inOut(Easing.cubic);
const easeOut = Easing.out(Easing.cubic);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const ramp = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });

// Keeps the phone's right edge clear of the caption column in close-ups.
const clampPose = (p: Pose): Pose => ({ ...p, x: Math.max(p.x, phone.w + phone.bezel - (column.x - 40 - phone.fx) / (phone.k * p.s)) });

const cameraAt = (t: number): Pose => clampPose(rawCameraAt(t));

const rawCameraAt = (t: number): Pose => {
  const keys = film.camera;
  const i = keys.findIndex((k) => k.t > t);
  if (i === -1) return keys[keys.length - 1];
  if (i === 0) return keys[0];
  const a = keys[i - 1];
  const b = keys[i];
  if ('cut' in b && b.cut) return a;
  const p = ramp(t, a.t, b.t);
  return { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p, s: a.s * Math.pow(b.s / a.s, p) };
};

const TRANSITION = { cut: 0, fade: 0.25, slide: 0.35, wipe: 0.85 } as const;

const ScreenImage = ({ screen, t, style }: { screen: Screen; t: number; style?: CSSProperties }) => {
  const keys = (film.scroll as Record<string, number[][]>)[screen.src];
  const scrollY = keys ? interpolate(t, keys.map((k) => k[0]), keys.map((k) => k[1]), { ...clamp, easing: ease }) : 0;
  return (
    <Img
      src={staticFile(`screens/${screen.src}.png`)}
      style={{ position: 'absolute', left: 0, top: -scrollY, width: phone.w, ...style }}
    />
  );
};

const Screens = ({ t }: { t: number }) => {
  const idx = film.screens.findLastIndex((s) => s.t <= t);
  const cur = film.screens[Math.max(idx, 0)];
  const prev = idx > 0 ? film.screens[idx - 1] : null;
  const fx = cur.fx as keyof typeof TRANSITION;
  const p = TRANSITION[fx] ? ramp(t, cur.t, cur.t + TRANSITION[fx]) : 1;
  const inTransition = prev && p < 1;

  let curStyle: CSSProperties = {};
  if (inTransition && fx === 'fade') curStyle = { opacity: p };
  if (inTransition && fx === 'slide') curStyle = { opacity: p, transform: `translateY(${(1 - p) * 60}px)` };
  if (inTransition && fx === 'wipe') {
    const edge = -30 + p * 160;
    const mask = `linear-gradient(110deg, black ${edge - 25}%, transparent ${edge}%)`;
    curStyle = { WebkitMaskImage: mask, maskImage: mask };
  }

  return (
    <>
      {inTransition ? <ScreenImage screen={prev} t={t} /> : null}
      <ScreenImage screen={cur} t={t} style={curStyle} />
      {inTransition && fx === 'wipe' ? <WipeBand p={p} /> : null}
    </>
  );
};

const WipeBand = ({ p }: { p: number }) => (
  <div
    style={{
      position: 'absolute',
      top: -200,
      left: -260 + p * 900,
      width: phone.w * 0.38,
      height: phone.h + 400,
      background: color.accentWipe,
      opacity: 0.85 * Math.sin(Math.PI * p),
      filter: 'blur(28px)',
      transform: 'rotate(20deg)',
    }}
  />
);

const Taps = ({ t }: { t: number }) => (
  <>
    {film.taps.map((tap, i) => {
      const local = t - tap.t;
      if (local < -0.3 || local > (tap.hint ? 1.4 : 0.6)) return null;
      const pulse = tap.hint ? (local % 0.7 + 0.7) % 0.7 : local;
      const grow = interpolate(pulse, [-0.3, 0, 0.6], [0.6, 1, 1.5], clamp);
      const alpha = interpolate(pulse, [-0.3, -0.05, 0.15, 0.6], [0, 0.95, 0.9, 0], clamp);
      const accent = 'accent' in tap && tap.accent;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: tap.x - 22,
            top: tap.y - 22,
            width: 44,
            height: 44,
            borderRadius: 22,
            border: `2px solid ${color.accent}`,
            background: accent ? 'rgba(184,198,190,.55)' : 'rgba(61,79,71,.16)',
            boxShadow: accent ? `0 0 24px 8px ${color.accentGlow}` : 'none',
            transform: `scale(${grow})`,
            opacity: alpha,
          }}
        />
      );
    })}
  </>
);

const Notification = ({ t }: { t: number }) => {
  const n = film.notifications[0];
  if (!n) return null;
  const p = ramp(t, n.from, n.from + 0.45, easeOut) - ramp(t, n.to - 0.4, n.to, Easing.in(Easing.cubic));
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 10,
        right: 10,
        top: -110 + p * 122,
        padding: '12px 14px',
        borderRadius: 20,
        background: 'rgba(250,249,246,.97)',
        boxShadow: '0 10px 30px rgba(40,30,20,.22)',
        display: 'flex',
        gap: 10,
        fontFamily: font.sans,
      }}
    >
      <Img src={staticFile(brand.icon)} style={{ width: 38, height: 38, borderRadius: 9 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: color.inkDim, letterSpacing: 0.4 }}>
          <span>{brand.appName.toUpperCase()}</span>
          <span>now</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: color.ink, marginTop: 2 }}>{n.title}</div>
        <div style={{ fontSize: 13, color: color.inkSoft, lineHeight: 1.3, marginTop: 1 }}>{n.body}</div>
      </div>
    </div>
  );
};

const Phone = ({ t }: { t: number }) => {
  const cam = cameraAt(t);
  const exit = ramp(t, film.taglineFrom, film.taglineFrom + 0.67, Easing.in(Easing.cubic));
  const k = phone.k * cam.s;
  const transform = `translate(${phone.fx}px, ${phone.fy - exit * 1100}px) scale(${k}) translate(${-cam.x}px, ${-cam.y}px)`;
  const b = phone.bezel;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform }}>
      <div
        style={{
          position: 'absolute',
          left: -b,
          top: -b,
          width: phone.w + 2 * b,
          height: phone.h + 2 * b,
          borderRadius: phone.radius,
          background: '#1d211f',
          boxShadow: '0 28px 70px rgba(60,45,30,.22), 0 2px 8px rgba(0,0,0,.08)',
        }}
      />
      <div style={{ position: 'absolute', width: phone.w, height: phone.h, borderRadius: phone.radius - b, overflow: 'hidden', background: color.stage }}>
        <Screens t={t} />
        <Taps t={t} />
        <Notification t={t} />
      </div>
    </div>
  );
};

const Column = ({ t }: { t: number }) => {
  const idx = film.chapters.findLastIndex((c) => c.t <= t);
  if (idx < 0 || t >= film.taglineFrom) return null;
  const ch = film.chapters[idx];
  const inP = ramp(t, ch.t, ch.t + 0.35, easeOut);
  const ms = t * 1000;
  const page = captions.find((c) => c.startMs <= ms && ms < c.endMs && c.startMs < film.taglineFrom * 1000);
  const pageIn = page ? ramp(ms, page.startMs, page.startMs + 160, easeOut) : 0;
  return (
    <div style={{ position: 'absolute', left: column.x, width: column.w, top: 330 }}>
      <div style={{ opacity: inP, transform: `translateY(${(1 - inP) * 14}px)` }}>
        <div style={{ fontFamily: font.sans, fontWeight: 600, fontSize: 22, letterSpacing: 6, color: color.inkDim }}>
          {ch.n} / {String(film.chapters.length).padStart(2, '0')}
        </div>
        <div style={{ fontFamily: font.serif, fontSize: 84, lineHeight: 1.1, color: color.ink, marginTop: 10 }}>{ch.title}</div>
      </div>
      <div style={{ height: 2, width: 64, background: color.accent, margin: '34px 0 30px', opacity: inP }} />
      {page ? (
        <div
          style={{
            fontFamily: font.sans,
            fontWeight: 500,
            fontSize: 44,
            lineHeight: 1.35,
            color: color.inkSoft,
            textWrap: 'balance',
            opacity: pageIn,
            transform: `translateY(${(1 - pageIn) * 6}px)`,
          }}
        >
          {page.text}
        </div>
      ) : null}
    </div>
  );
};

const Opener = ({ t }: { t: number }) => {
  const settle = ramp(t, 0.2, 0.95, easeOut);
  const push = interpolate(t, [film.stageFrom - 0.125, film.stageFrom], [1, 1.04], { ...clamp, easing: Easing.in(Easing.cubic) });
  const [title, sub] = film.opener;
  const line = (from: number) => ramp(t, from, from + 0.3, easeOut);
  const drift = 1 + 0.025 * ramp(t, 1, film.stageFrom, Easing.linear);
  return (
    <AbsoluteFill style={{ background: color.oat, alignItems: 'center', justifyContent: 'center', transform: `scale(${push * drift})` }}>
      <div style={{ transform: `translateY(${(1 - settle) * 140}px) scale(${1.25 - 0.25 * settle})` }}>
        <Img src={staticFile(brand.logo)} style={{ width: 520 }} />
      </div>
      <div style={{ textAlign: 'center', marginTop: 48, transform: `translateY(${(1 - settle) * 140}px)` }}>
        <div style={{ fontFamily: font.serif, fontSize: 96, lineHeight: 1.2, color: color.ink, opacity: line(title.t), transform: `translateY(${(1 - line(title.t)) * 10}px)` }}>
          {title.text}
        </div>
        <div
          style={{
            fontFamily: font.sans,
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: color.inkDim,
            marginTop: 28,
            opacity: line(sub.t),
            transform: `translateY(${(1 - line(sub.t)) * 10}px)`,
          }}
        >
          {sub.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Tagline = ({ t }: { t: number }) => {
  const inP = ramp(t, film.taglineFrom + 0.4, film.taglineFrom + 0.65, easeOut);
  const out = 1 - ramp(t, film.logoFrom - 0.125, film.logoFrom);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: font.serif, fontSize: 80, color: color.ink, opacity: inP * out, transform: `translateY(${(1 - inP) * 40}px)` }}>
        {brand.tagline}
      </div>
    </AbsoluteFill>
  );
};

const Logo = ({ t }: { t: number }) => {
  const p = ramp(t, film.logoFrom + 0.125, film.logoFrom + 0.55, easeOut);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Img src={staticFile(brand.logo)} style={{ width: 557, opacity: p, transform: `scale(${0.9 + 0.1 * p})` }} />
    </AbsoluteFill>
  );
};

export const PhoneTutorial = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{ background: color.stage, width: WIDTH, height: HEIGHT, overflow: 'hidden' }}>
      {t < film.stageFrom ? <Opener t={t} /> : null}
      {t >= film.stageFrom && t < film.taglineFrom + 0.7 ? (
        <>
          <Phone t={t} />
          <Column t={t} />
        </>
      ) : null}
      {t >= film.taglineFrom && t < film.logoFrom ? <Tagline t={t} /> : null}
      {t >= film.logoFrom ? <Logo t={t} /> : null}
      <Audio src={staticFile('mix.wav')} />
    </AbsoluteFill>
  );
};
