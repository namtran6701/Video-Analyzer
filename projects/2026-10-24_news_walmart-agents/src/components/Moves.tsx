import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../fonts";
import { spring } from "../lib/motion";
import { color, HEIGHT, motion, size, WIDTH } from "../tokens";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const useLocal = (from: number) => useCurrentFrame() - from;

// N1 cold-open / section card.
export const TextCard: React.FC<{ text: string; sub?: string }> = ({ text, sub }) => (
  <AbsoluteFill style={{ backgroundColor: color.bg, justifyContent: "center", alignItems: "center", gap: 24 }}>
    <div
      style={{
        fontFamily: fonts.display,
        fontSize: HEIGHT * size.coldOpen,
        color: color.text,
        textTransform: "uppercase",
        textAlign: "center",
        maxWidth: WIDTH * 0.8,
        lineHeight: 1.1,
      }}
    >
      {text}
    </div>
    {sub && (
      <div style={{ fontFamily: fonts.label, fontSize: 64, color: color.highlight, textTransform: "uppercase", letterSpacing: 2 }}>
        {sub}
      </div>
    )}
  </AbsoluteFill>
);

// N2 channel sting: own mark (a cart glyph inside a ring), stroke reveal over a fading glow.
export const Sting: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [0, 18], [0, 1], clamp);
  const glow = interpolate(frame, [4, 12], [0, 1], clamp);
  const len = 1200;
  return (
    <AbsoluteFill style={{ backgroundColor: color.bg, justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color.highlight}55 0%, transparent 65%)`,
          opacity: glow,
        }}
      />
      <svg width={360} height={360} viewBox="0 0 360 360">
        <g fill="none" stroke={color.text} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round">
          <circle cx={180} cy={180} r={150} strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
          <path
            d="M95 120 h30 l28 100 h105 l22 -72 h-140"
            stroke={color.accent}
            strokeDasharray={len}
            strokeDashoffset={len * (1 - interpolate(frame, [6, 22], [0, 1], clamp))}
          />
          <circle cx={165} cy={255} r={10} fill={color.accent} stroke="none" opacity={interpolate(frame, [20, 23], [0, 1], clamp)} />
          <circle cx={240} cy={255} r={10} fill={color.accent} stroke="none" opacity={interpolate(frame, [21, 24], [0, 1], clamp)} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// N8 stamp label (screen space).
export const Stamp: React.FC<{ text: string; x: number; y: number; from: number; scale?: number; fill?: string }> = ({
  text,
  x,
  y,
  from,
  scale = 1,
  fill = color.stamp,
}) => {
  const f = useLocal(from);
  const { fps } = useVideoConfig();
  if (f < 0) return null;
  const pop = spring(f / fps, "playful");
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${(random(text) - 0.5) * 6}deg) scale(${pop * scale})`,
        backgroundColor: fill,
        color: "#fff",
        fontFamily: fonts.label,
        fontSize: 58,
        lineHeight: 1,
        textTransform: "uppercase",
        padding: "0.3em 0.6em",
        whiteSpace: "nowrap",
        boxShadow: `0 8px 24px ${color.shadow}`,
      }}
    >
      {text}
    </div>
  );
};

// N7 marker arrow from a to b, bowed by `bend`.
export const Arrow: React.FC<{ a: [number, number]; b: [number, number]; from: number; bend?: number }> = ({ a, b, from, bend = 80 }) => {
  const f = useLocal(from);
  if (f < 0) return null;
  const [mx, my] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - bend];
  const t = interpolate(f, [0, motion.arrowDraw], [0, 1], clamp);
  const h = interpolate(f, [motion.arrowDraw, motion.arrowDraw + motion.arrowHead], [0, 1], clamp);
  const ang = Math.atan2(b[1] - my, b[0] - mx);
  const head = (d: number) => `M${b[0]} ${b[1]} L${b[0] - 46 * Math.cos(ang + d)} ${b[1] - 46 * Math.sin(ang + d)}`;
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={WIDTH} height={HEIGHT}>
      <g fill="none" stroke={color.text} strokeWidth={8} strokeLinecap="round">
        <path d={`M${a[0]} ${a[1]} Q${mx} ${my} ${b[0]} ${b[1]}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
        <path d={head(0.5)} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - h} />
        <path d={head(-0.5)} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - h} />
      </g>
    </svg>
  );
};

// N12 red X over a screen-space box.
export const RedX: React.FC<{ box: [number, number, number, number]; from: number; width?: number }> = ({ box, from, width = 18 }) => {
  const f = useLocal(from);
  if (f < 0) return null;
  const [x, y, w, h] = box;
  const a = interpolate(f, [0, 3], [0, 1], clamp);
  const b = interpolate(f, [2, 5], [0, 1], clamp);
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={WIDTH} height={HEIGHT}>
      <g stroke={color.stamp} strokeWidth={width} strokeLinecap="round">
        <path d={`M${x} ${y} L${x + w} ${y + h}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - a} />
        <path d={`M${x + w} ${y} L${x} ${y + h}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - b} />
      </g>
    </svg>
  );
};

// N13 big word card.
export const BigWord: React.FC<{ word: string; children?: React.ReactNode }> = ({ word, children }) => (
  <AbsoluteFill style={{ backgroundColor: color.bg, justifyContent: "center", alignItems: "center" }}>
    <div style={{ fontFamily: fonts.word, fontWeight: 900, fontSize: HEIGHT * size.bigWord, color: color.textWarm, letterSpacing: -6 }}>
      {word}
    </div>
    {children}
  </AbsoluteFill>
);

// N14 hero word slam.
export const Hero: React.FC<{ text: string; from: number; y?: number }> = ({ text, from, y = HEIGHT * 0.5 }) => {
  const f = useLocal(from);
  const { fps } = useVideoConfig();
  if (f < 0) return null;
  const k = 1.4 - 0.4 * spring(f / fps, "snappy");
  return (
    <div
      style={{
        position: "absolute",
        left: WIDTH / 2,
        top: y,
        transform: `translate(-50%, -50%) scale(${k}) skewX(-8deg)`,
        fontFamily: fonts.hero,
        fontSize: HEIGHT * size.hero,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        background: `linear-gradient(180deg, ${color.accent}, ${color.highlight})`,
        WebkitBackgroundClip: "text",
        color: "transparent",
        WebkitTextStroke: `6px ${color.bg}`,
        paintOrder: "stroke fill",
        filter: `drop-shadow(8px 8px 0 ${color.bg})`,
      }}
    >
      {text}
    </div>
  );
};

// N16 glitch slice over any base, for its first frames.
export const Glitch: React.FC<{ from: number; frames?: number; children: React.ReactNode }> = ({ from, frames = motion.glitchFrames, children }) => {
  const f = useLocal(from);
  const on = f >= 0 && f < frames;
  if (!on) return <>{children}</>;
  const bands = 8;
  return (
    <AbsoluteFill>
      {Array.from({ length: bands }, (_, i) => {
        const off = (random(`g${i}${f}`) - 0.5) * 160;
        const clip = `inset(${(i / bands) * 100}% 0 ${100 - ((i + 1) / bands) * 100}% 0)`;
        return (
          <AbsoluteFill key={i} style={{ clipPath: clip, transform: `translateX(${off}px)` }}>
            <AbsoluteFill style={{ filter: "drop-shadow(4px 0 0 rgba(255,0,80,.8)) drop-shadow(-4px 0 0 rgba(0,255,230,.8))" }}>
              {children}
            </AbsoluteFill>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

// N11 meme cutaway.
export const Meme: React.FC<{ src: string }> = ({ src }) => (
  <AbsoluteFill style={{ backgroundColor: color.bg }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </AbsoluteFill>
);

// N18 cause-effect chain: one box (plus incoming arrow) per spoken step; last box filled.
export const Chain: React.FC<{ steps: { label: string; at: number }[] }> = ({ steps }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bw = 330;
  const gap = (WIDTH - 160 - bw * steps.length) / (steps.length - 1);
  const y = HEIGHT / 2;
  return (
    <AbsoluteFill style={{ backgroundColor: color.bg }}>
      {steps.map((s, i) => {
        const f = frame - s.at;
        if (f < 0) return null;
        const x = 80 + i * (bw + gap);
        const last = i === steps.length - 1;
        return (
          <div key={i}>
            {i > 0 && <Arrow a={[x - gap + 20, y]} b={[x - 20, y]} from={s.at} bend={18} />}
            <div
              style={{
                position: "absolute",
                left: x,
                top: y - 110,
                width: bw,
                height: 220,
                borderRadius: 28,
                border: `6px solid ${last ? color.stamp : color.text}`,
                backgroundColor: last ? color.stamp : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                fontFamily: fonts.display,
                fontSize: 52,
                lineHeight: 1.05,
                color: color.text,
                textTransform: "uppercase",
                transform: `scale(${spring(f / fps, "playful")})`,
              }}
            >
              {s.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// N19 takeaway card: sentence with one highlighted phrase, optional second line.
export const Takeaway: React.FC<{
  before: string;
  key_: string;
  after?: string;
  keyAt?: number; // frame the key phrase appears; shown from the start when omitted
  line2?: { text: string; at: number };
}> = ({ before, key_, after = "", keyAt = 0, line2 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: color.bg, justifyContent: "center", alignItems: "center", gap: 48 }}>
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: HEIGHT * size.takeaway,
          color: color.text,
          textAlign: "center",
          maxWidth: WIDTH * 0.78,
          lineHeight: 1.2,
        }}
      >
        {before}
        <span style={{ color: color.highlight, opacity: frame >= keyAt ? 1 : 0 }}>{key_}</span>
        {after}
      </div>
      {line2 && frame >= line2.at && (
        <div style={{ fontFamily: fonts.label, fontSize: 76, color: color.accent, textTransform: "uppercase", letterSpacing: 1 }}>
          {line2.text}
        </div>
      )}
    </AbsoluteFill>
  );
};
