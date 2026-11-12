# Stock sourcing and Adobe tools

Every stock shot searches both Getty and Adobe Stock, and the user picks. Adobe: free results only, never paid. Getty: built with watermarked comps; whether to license each one is decided at the end. Getty's tool rules (coverage, restrictions, sizes, licensing, swap) live in the `getty-images` skill: invoke it. Here the user picks from the contact sheet, which replaces its "Claude picks" steps.
1. **Search.** Getty: 2-3 phrasings, 10-15 candidates in total (`display: brief_building`), creative search for commercial work. No resolution filter: 1080p is checked at coverage. Adobe, only when its MCP is connected (`adobe_mandatory_init` first): one simple query per medium (long phrases plus filters return 0 hits), `contentType` Video for footage; keep only results that license free. Adobe not connected: Getty only, and tell the user.
2. **Screen Getty before showing anything.** One `get_available_download_sizes` call for every candidate ID across all shots (it opens a widget, so batch). Keep `status: available` assets covered by the plan, with `hd16` for video. For commercial work drop `commercialUseRestricted` and `editorialUseOnly` assets and tell the user which and why.
3. **Contact sheet, shown to the user.** Build one labeled image per shot with ffmpeg, one tile per candidate: Getty `watermarkedCompUrl` (images) or a frame from the comp mp4 (video, `ffmpeg -ss 1 -i comp.mp4 -frames:v 1`), Adobe `renditionURL` (thumbnail only, 240px). Label each tile with source and ID (e.g. `G 1335175372`, `A 482994104`) and keep Getty and Adobe in separate rows. Put it in the scratchpad, show it with Read, and ask which to use. State plainly that Adobe tiles are low-res thumbnails and Getty tiles are watermarked comps.
4. **Build with the pick.** Getty: save the comp to `public/stock/` and build with it. Adobe: no comp exists, so confirm, then license the free asset right away into `public/stock/`. Log each in `docs/stock_manifest.json`: `{ id, source, title, file, shots, status: "comp" | "licensed", product, size, date }`.
5. **Footage to H.264 at project fps**, comps and licensed files alike, so the swap doesn't change timing: `ffmpeg -i <in> -c:v libx264 -r <fps> -pix_fmt yuv420p -an public/stock/<id>.mp4`. Licensed 1080p Getty video arrives as `.mov`, often at 23.98 or 25 fps. Keep `public/stock/` out of version control (a 1080p clip is about 100 MB).
6. **License round** after the critique loop, before the final render: list every Getty comp still in the cut (ID, title, shots, size `largest` or `hd16`, product, 1 download each) and the user says yes or no per asset. Yes: license and swap per `getty-images`, update the manifest. No: replace that shot with a free Adobe pick or a generated image (confirmed like any generation), then re-render the affected frames.
7. Generate with `genmedia-assets` only when neither source has a fit or the shot needs something stock can't (the product itself, a specific brand scene).

## Assets (Adobe, optional)
Only when the Adobe MCP is connected; call `adobe_mandatory_init` once per conversation (it returns ~6k tokens of routing docs, so never again). Poly Haven stays the source for 3D, HDRIs and textures.
- Photos and footage: see **Stock sourcing** above (free results only).
- Neither Getty nor free Adobe has a fit, or the shot needs something Stock can't have (the product itself, a specific brand scene): generate it with the `genmedia-assets` skill.
- Cutouts for layered or parallax shots: `image_remove_background` (transparent PNG).
- Logos, icons and simple flat shapes to animatable SVG: `image_vectorize`. Not for photos; auto-traced photos morph badly.
- Fill a format without bad crops: `image_generative_expand` (16:9 ↔ 9:16).
- Halftone, glitch, color and grain tools to bake a look into a photo or plate before it's animated. Film grain over moving frames still goes in the comp.
- Recorded voiceover cleanup: `media_enhance_speech` (see Voiceover and captions).
- Not for animation: Remotion does that, and `animate_design` is too basic.
