import { loadFont as anton } from "@remotion/google-fonts/Anton";
import { loadFont as inter } from "@remotion/google-fonts/Inter";
import { loadFont as lilita } from "@remotion/google-fonts/LilitaOne";
import { loadFont as oswald } from "@remotion/google-fonts/Oswald";

export const fonts = {
  display: lilita("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
  label: oswald("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily,
  hero: anton("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
  word: inter("normal", { weights: ["900"], subsets: ["latin"] }).fontFamily,
};
