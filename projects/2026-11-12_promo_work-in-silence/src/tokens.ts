export const FPS = 30;
export const DURATION = 900;

export const C = {
  ground: "#040404",
  text: "#ffffff",
  label: "#949494",
  silverTop: "#b9bdc1",
  silverBottom: "#707778",
};

export const FONT = { display: "Montserrat", ui: "Inter", mono: "JetBrains Mono" };

// 1 unit = 1px on the short side of a 1080 frame.
export const unit = (width: number, height: number) => Math.min(width, height) / 1080;

// Caption baseline as a fraction of height: inside the 9:16 bottom band (62-78%), above the Reels overlay zone.
export const CAPTION_BASELINE = 0.72;
