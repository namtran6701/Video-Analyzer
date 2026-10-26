import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { Evidence, Hand, Highlight, RedBox } from "./components/Evidence";
import { Arrow, BigWord, Chain, Glitch, Hero, Meme, RedX, Stamp, Sting, Takeaway, TextCard } from "./components/Moves";
import { around, bbox, centre, rects } from "./evidence";
import { fonts } from "./fonts";
import { color, FPS, HEIGHT, WIDTH } from "./tokens";
import { at, rowStart, VO_END } from "./words";

export const TAIL = Math.round(1.2 * FPS);
export const DURATION = VO_END + TAIL;

// A shot is a base visual between two cuts. `el` gets its own start frame so overlays can be keyed
// to absolute word times: r(at(...)) converts to the shot-local frame.
type Shot = { from: number; el: (r: (f: number) => number) => React.ReactNode };

const STING_FROM = Math.round(6.0 * FPS);

const shots: Shot[] = [
  // Hook
  { from: 0, el: () => <TextCard text="Amazon: no bots allowed." /> },
  {
    from: at(1, "agents"),
    el: () => <Evidence file="r17-adweek" region={[30, 45, 760, 118]} focus={[300, 110]} />,
  },
  { from: rowStart(2), el: () => <TextCard text="Walmart: come on in..." /> },
  {
    from: at(2, "entrance"),
    el: (r) => (
      <>
        <Evidence file="r02-techcrunch" region={[900, 560, 900, 260]} focus={[1150, 690]} />
        <Stamp text="with a spending limit" x={WIDTH * 0.5} y={HEIGHT * 0.78} from={r(at(2, "spending"))} />
      </>
    ),
  },
  { from: STING_FROM, el: () => <Sting /> },

  // What happened
  {
    from: rowStart(4),
    el: (r) => (
      <>
        <Evidence file="r04-walmart-header" fill focus={[960, 300]}>
          <RedBox rect={rects("r04-walmart-header", "date")[0]} from={r(at(4, "October"))} />
        </Evidence>
        <Stamp text="Walmart" x={WIDTH * 0.17} y={HEIGHT * 0.52} from={r(at(4, "Walmart"))} />
        <Hero text="Agent Gateway" from={r(at(4, "Agent"))} y={HEIGHT * 0.72} />
      </>
    ),
  },
  {
    from: rowStart(5),
    el: (r) => (
      <>
        <Evidence file="r05-introducing" region={around("r05-introducing", ["hl"], 600)}>
          <Highlight rects={rects("r05-introducing", "hl")} from={r(at(5, "can"))} />
        </Evidence>
        <Stamp text="Sam's Club" x={WIDTH * 0.78} y={HEIGHT * 0.15} from={r(at(5, "Sam's"))} />
      </>
    ),
  },
  {
    from: rowStart(6),
    el: (r) => (
      <>
        <Evidence file="r06-named-agents" region={around("r06-named-agents", ["hl"], 600)}>
          <Highlight rects={rects("r06-named-agents", "hl")} from={r(at(6, "already"))} />
        </Evidence>
        <Stamp text="ChatGPT" x={WIDTH * 0.22} y={HEIGHT * 0.84} from={r(at(6, "ChatGPT"))} />
        <Stamp text="Gemini" x={WIDTH * 0.5} y={HEIGHT * 0.86} from={r(at(6, "Gemini"))} />
        <Stamp text="Muse" x={WIDTH * 0.76} y={HEIGHT * 0.83} from={r(at(6, "Meta's"))} />
      </>
    ),
  },
  {
    from: rowStart(7),
    el: (r) => (
      <Evidence file="r07-agent-profiles" region={around("r07-agent-profiles", ["month", "hl"])}>
        <RedBox rect={rects("r07-agent-profiles", "month")[0]} from={r(at(7, "month"))} />
        <Highlight rects={rects("r07-agent-profiles", "hl")} from={r(at(7, "profile"))} />
      </Evidence>
    ),
  },

  // How it works
  { from: rowStart(8), el: () => <BigWord word="ai agent" /> },
  { from: at(8, "very"), el: () => <BigWord word="very fast" /> },
  { from: at(8, "intern"), el: () => <BigWord word="intern" /> },
  {
    from: rowStart(9),
    el: (r) => (
      <Evidence file="r09-browser-agents" region={around("r09-browser-agents", ["people"])}>
        <Highlight rects={rects("r09-browser-agents", "people")} from={r(at(9, "clicks"))} />
      </Evidence>
    ),
  },
  {
    from: rowStart(10),
    el: (r) => (
      <Evidence file="r09-browser-agents" region={around("r09-browser-agents", ["slow"])} focus={centre(bbox(rects("r09-browser-agents", "slow")))}>
        <Highlight rects={rects("r09-browser-agents", "people")} from={-99} seed="p" />
        <Highlight rects={rects("r09-browser-agents", "slow")} from={r(at(10, "slow"))} />
      </Evidence>
    ),
  },
  { from: at(10, "button"), el: () => <Meme src="memes/r10.png" /> },
  {
    from: at(10, "button") + 28,
    el: (r) => (
      <>
        <Evidence file="r09-browser-agents" region={around("r09-browser-agents", ["slow"])} push={1.02}>
          <Highlight rects={rects("r09-browser-agents", "people")} from={-99} seed="p" />
          <Highlight rects={rects("r09-browser-agents", "slow")} from={-99} />
        </Evidence>
        <RedX box={[WIDTH * 0.12, HEIGHT * 0.2, WIDTH * 0.76, HEIGHT * 0.6]} from={r(at(11, "skips"))} />
      </>
    ),
  },
  {
    from: rowStart(12),
    el: (r) => (
      <>
        <Evidence file="r12-mcp" region={[575, 170, 470, 110]} focus={[700, 220]} />
        <Stamp text="MCP" x={WIDTH * 0.8} y={HEIGHT * 0.2} from={r(at(12, "MCP"))} scale={1.3} />
      </>
    ),
  },
  {
    from: at(12, "standard") - 2,
    el: (r) => (
      <Evidence file="r12-mcp" region={[575, 470, 470, 26]} focus={centre(bbox(rects("r12-mcp", "usbc")))}>
        <Highlight rects={rects("r12-mcp", "usbc")} from={r(at(12, "standard"))} />
      </Evidence>
    ),
  },
  {
    from: at(12, "and"),
    el: (r) => (
      <Chain
        steps={[
          { label: "AI agent", at: 0 },
          { label: "MCP", at: r(at(12, "get")) },
          { label: "product · price · stock", at: r(at(12, "price")) },
          { label: "Walmart", at: r(at(12, "Walmart")) },
        ]}
      />
    ),
  },
  {
    from: rowStart(13),
    el: (r) => {
      const lim = bbox(rects("r13-approval", "limits"));
      return (
        <Evidence file="r13-approval" region={around("r13-approval", ["approve", "limits"])} focus={centre(lim)}>
          <Highlight rects={rects("r13-approval", "approve")} from={r(at(14, "Approve"))} />
          <RedBox rect={lim} from={r(at(14, "spend"))} />
          <Hand rect={lim} from={r(at(14, "limit"))} />
        </Evidence>
      );
    },
  },
  { from: rowStart(15), el: (r) => <PriceSplit r={r} /> },

  // Stakes
  { from: rowStart(16), el: () => <BigWord word="amazon" /> },
  {
    from: rowStart(17),
    el: (r) => (
      <>
        <Evidence file="r17-adweek" region={[0, 0, 900, 330]} focus={[450, 260]}>
          <Highlight rects={rects("r17-adweek", "disclosed")} from={r(at(17, "never"))} />
          <Highlight rects={rects("r17-adweek", "identify")} from={r(at(17, "itself"))} />
        </Evidence>
        <Stamp text="Meta's Muse" x={WIDTH * 0.8} y={HEIGHT * 0.14} from={r(at(17, "Meta's"))} />
        <Stamp text="Blocked in September" x={WIDTH * 0.24} y={HEIGHT * 0.86} from={r(at(17, "blocked"))} fill={color.panel} />
      </>
    ),
  },
  { from: rowStart(18), el: () => <TextCard text="The part nobody says out loud:" /> },
  {
    from: at(18, "never"),
    el: (r) => (
      <BigWord word="ads">
        <RedX box={[WIDTH * 0.3, HEIGHT * 0.25, WIDTH * 0.4, HEIGHT * 0.5]} from={r(at(18, "sees"))} />
      </BigWord>
    ),
  },
  {
    from: rowStart(19),
    el: (r) => (
      <Evidence file="r19-amazon-sponsored" region={[350, 690, 460, 230]} focus={[395, 730]} push={1.06}>
        <RedBox rect={rects("r19-amazon-sponsored", "sponsored")[0]} from={r(at(19, "sponsored"))} />
      </Evidence>
    ),
  },
  {
    from: at(19, "no", 1),
    el: (r) => (
      <Evidence file="r19-amazon-sponsored" region={[360, 400, 330, 220]} focus={[500, 560]} push={1.06}>
        <RedBox rect={rects("r19-amazon-sponsored", "cart")[0]} from={r(at(19, "add-to-cart"))} />
        <RedBox rect={rects("r19-amazon-sponsored", "prime")[0]} from={r(at(19, "Prime"))} />
        <Hand rect={rects("r19-amazon-sponsored", "prime")[0]} from={r(at(19, "upsell"))} />
      </Evidence>
    ),
  },
  { from: at(19, "upsell"), el: () => <Meme src="memes/r19.png" /> },
  {
    from: at(19, "upsell") + 30,
    el: (r) => <Takeaway before="For Amazon, every agent order is " key_="an ad nobody saw." keyAt={r(at(20, "an"))} />,
  },
  { from: rowStart(21), el: (r) => <Swap r={r} /> },
  {
    from: rowStart(22),
    el: (r) => (
      <>
        <Glitch from={0}>
          <Evidence file="r09-browser-agents" region={around("r09-browser-agents", ["beta"])} focus={centre(bbox(rects("r09-browser-agents", "beta")))}>
            <Highlight rects={rects("r09-browser-agents", "beta")} from={r(at(22, "invite-only"))} />
          </Evidence>
        </Glitch>
        <Stamp text="invite only" x={WIDTH * 0.74} y={HEIGHT * 0.2} from={r(at(22, "invite-only"))} />
        <Stamp text="Walmart picks" x={WIDTH * 0.3} y={HEIGHT * 0.82} from={r(at(22, "picks"))} fill={color.panel} />
      </>
    ),
  },
  { from: rowStart(23), el: () => <BigWord word="open door" /> },
  { from: at(23, "with"), el: () => <BigWord word="bouncer" /> },

  // Field note
  { from: rowStart(24), el: () => <TextCard text="The test I'd run" sub="before trusting any of this" /> },
  { from: rowStart(25), el: (r) => <TowelTest r={r} /> },
  { from: rowStart(26), el: (r) => <LogTable r={r} /> },
  {
    from: rowStart(27),
    el: (r) => (
      <BigWord word="loyalty">
        <Stamp text="switched brands" x={WIDTH * 0.5} y={HEIGHT * 0.2} from={r(at(27, "switches"))} />
        <RedX box={[WIDTH * 0.2, HEIGHT * 0.3, WIDTH * 0.6, HEIGHT * 0.4]} from={r(at(27, "lost"))} />
      </BigWord>
    ),
  },
  { from: at(27, "spreadsheet"), el: () => <Meme src="memes/r27.png" /> },

  // Takeaway
  {
    from: rowStart(28),
    el: () => <Takeaway before="Amazon can lock the door. Bots will shop " key_="where they're welcome." />,
  },
  {
    from: rowStart(29),
    el: (r) => (
      <Takeaway
        before="Treat your "
        key_="product feed"
        after=" like a storefront."
        line2={{ text: "The next shopper might not have eyes.", at: r(at(29, "The")) }}
      />
    ),
  },
];

const PriceSplit: React.FC<{ r: (f: number) => number }> = ({ r }) => {
  const frame = useCurrentFrame();
  const card = (left: number, label: string, sub: string, show: number, img?: string) =>
    frame >= show && (
      <div
        style={{
          position: "absolute",
          left,
          top: HEIGHT * 0.14,
          width: WIDTH * 0.4,
          height: HEIGHT * 0.72,
          borderRadius: 32,
          border: `6px solid ${color.text}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        {img ? (
          <Img
            src={staticFile(img)}
            style={{ width: 380, height: 380, objectFit: "cover", borderRadius: 16 }}
            durationInFrames={114}
          />
        ) : (
          <div style={{ fontSize: 300, lineHeight: 1 }}>📺</div>
        )}
        <div style={{ fontFamily: fonts.hero, fontSize: 130, color: color.accent }}>{label}</div>
        <div style={{ fontFamily: fonts.label, fontSize: 44, color: color.text, textTransform: "uppercase" }}>{sub}</div>
      </div>
    );
  return (
    <AbsoluteFill style={{ backgroundColor: color.bg }} durationInFrames={114}>
      {card(WIDTH * 0.07, "$50", "paper towels", 0, "stills/paper-towels.png")}
      {card(WIDTH * 0.53, "$200", "a TV", r(at(15, "Two")))}
      <Stamp text="sure ✓" x={WIDTH * 0.27} y={HEIGHT * 0.12} from={r(at(15, "sure"))} fill="#1fa45a" />
      <RedX box={[WIDTH * 0.56, HEIGHT * 0.2, WIDTH * 0.34, HEIGHT * 0.6]} from={r(at(15, "not"))} />
    </AbsoluteFill>
  );
};

// N17 swap: AD VIEW struck out, arrow, ORDER.
const Swap: React.FC<{ r: (f: number) => number }> = ({ r }) => {
  const frame = useCurrentFrame();
  const strike = Math.min(1, Math.max(0, (frame - r(at(21, "lose"))) / 4));
  return (
    <AbsoluteFill style={{ backgroundColor: color.bg }}>
      <Stamp text="Walmart's bet" x={WIDTH / 2} y={HEIGHT * 0.15} from={r(at(21, "Walmart"))} />
      <div style={{ position: "absolute", left: WIDTH * 0.08, top: HEIGHT * 0.38, fontFamily: fonts.hero, fontSize: 210, color: color.text }}>
        AD VIEW
        <div style={{ position: "absolute", left: -10, top: "52%", height: 16, width: `${strike * 104}%`, backgroundColor: color.stamp }} />
      </div>
      <Arrow a={[WIDTH * 0.47, HEIGHT * 0.52]} b={[WIDTH * 0.6, HEIGHT * 0.52]} from={r(at(21, "win"))} bend={60} />
      <Stamp text="the order" x={WIDTH * 0.78} y={HEIGHT * 0.52} from={r(at(21, "order"))} scale={1.6} />
    </AbsoluteFill>
  );
};

const TowelTest: React.FC<{ r: (f: number) => number }> = ({ r }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: color.bg }}>
      {frame >= r(at(25, "reorder")) && (
        <Img
          src={staticFile("stills/paper-towels.png")}
          style={{ position: "absolute", left: WIDTH / 2 - 330, top: HEIGHT / 2 - 330, width: 660, height: 660 }}
        />
      )}
      <Stamp text="ChatGPT" x={WIDTH * 0.18} y={HEIGHT * 0.3} from={r(at(25, "three"))} />
      <Stamp text="Gemini" x={WIDTH * 0.82} y={HEIGHT * 0.28} from={r(at(25, "agents"))} />
      <Stamp text="Muse" x={WIDTH * 0.2} y={HEIGHT * 0.74} from={r(at(25, "to"))} />
      <Stamp text="same order" x={WIDTH * 0.8} y={HEIGHT * 0.74} from={r(at(25, "same"))} fill={color.panel} />
    </AbsoluteFill>
  );
};

const LogTable: React.FC<{ r: (f: number) => number }> = ({ r }) => {
  const frame = useCurrentFrame();
  const cols = [
    { h: "Store", at: r(at(26, "where")) },
    { h: "Price", at: r(at(26, "what")) },
    { h: "Brand", at: r(at(26, "whether")) },
  ];
  const rows = ["ChatGPT", "Gemini", "Muse"];
  const cell: React.CSSProperties = {
    height: 190,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: `3px solid ${color.text}33`,
  };
  return (
    <AbsoluteFill style={{ backgroundColor: color.bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "grid", gridTemplateColumns: "420px repeat(3, 400px)", fontFamily: fonts.label, fontSize: 84, color: color.text }}>
        <div style={cell} />
        {cols.map((c) => (
          <div key={c.h} style={{ ...cell, color: color.highlight, textTransform: "uppercase", opacity: frame >= c.at ? 1 : 0 }}>
            {c.h}
          </div>
        ))}
        {rows.map((name) => (
          <div key={name} style={{ display: "contents" }}>
            <div style={{ ...cell, justifyContent: "flex-start", textTransform: "uppercase" }}>{name}</div>
            {cols.map((c) => (
              <div key={c.h} style={{ ...cell, fontFamily: fonts.display, color: color.accent, opacity: frame >= c.at + 4 ? 1 : 0 }}>
                ?
              </div>
            ))}
          </div>
        ))}
      </div>
      <Stamp text="usual brand?" x={WIDTH * 0.8} y={HEIGHT * 0.88} from={r(at(26, "usual"))} />
    </AbsoluteFill>
  );
};

export const Episode: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: color.bg }}>
    {shots.map((s, i) => {
      const to = i + 1 < shots.length ? shots[i + 1].from : DURATION;
      const r = (f: number) => f - s.from;
      return (
        <Sequence key={i} from={s.from} durationInFrames={to - s.from} premountFor={0}>
          {s.el(r)}
        </Sequence>
      );
    })}
    <Audio src={staticFile("mix.wav")} />
  </AbsoluteFill>
);

export const cutFrames = () => shots.map((s) => s.from);
