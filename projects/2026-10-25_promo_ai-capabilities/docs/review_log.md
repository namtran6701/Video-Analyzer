# Review log

Scores 1 to 10: hook, readability (phone), sound-off, motion, variety, composition, depth, brand, sound sync, polish, voice + captions.

## Round 1 (draft1, half scale)
Scores: 7, 5, 8, 7, 8, 6, 7, 8, 7, 6, 7
Worst 3 and fixes:
1. Readability: demo UI and problem props too small at phone size. Demo windows get a 1.12 base zoom; problem props 980 → 1240 px with 34 px mono; hook grid cells larger.
2. Composition: empty lower third inside demo windows. Window height 700 → 600, re-centred; Store Walk aisle and search tiles shortened to fit.
3. Polish: "~NUAL" label fragment visible at the start of the proof pull-out (78.6 s); Bonus chips tiny; laptop read as plastic. Labels hidden until the pull starts; chips 270x92 with 21 px mono; laptop slabs now rounded metallic boxes.

## Round 2 (stills at 18 beats)
Scores: 7, 7, 8, 7, 8, 7, 7, 8, 7, 7, 8
Remaining: Pricing setup still has spare room under the AI box; Capabilities frame crossfades read soft mid-transition; laptop still slightly flat-lit.

## Round 3 (full-res render, final-16x9.mp4)
Checks: 1920x1080, 30 fps, 111.74 s; -13.9 LUFS, true peak -1.1; stills md5-identical across two renders (incl. R3F frame); sound-off phone contact reads the story from type alone.
Scores: 8, 7, 8, 8, 8, 8, 7, 8, 7, 7, 8
Not yet 8+: small UI labels (mono 13 to 15 px) are hard to read at phone size; laptop still slightly flat; sound sync judged on the synthesized draft score only (Lyria final pending).

## v2 (user feedback 2026-10-25)
Changes: no Claude mentions on screen or in VO ("our AI design system" / "our AI"); Channellock and IIP recaptured at Jan 2025 with altered headline numbers, no blur; client builds tagged "Built for a client" and the VO names the client scheduling app; voice now Puck (upbeat); Lyria take D (120 BPM, conformed to 116, drift 6.7 ms) replaces the synth score; slot list reordered to land on the VO words.
Checks: 1920x1080, 30 fps, 111.74 s; -13.9 LUFS, true peak -1.2.

## v3 (user feedback 2026-10-25)
Changes: opener problems now map to the three hero apps (estimates from memory, unsearchable store photos, AI know-how stuck with a few people); Pricing story is history (246 past estimates) + advisory market scan + reviewer feedback + a person's final call (verified in generate-plan.js, market-scan.js, review-state.js); trust line "AI drafts. Code does the math. People decide."; new Puck take; every act's actions keyed to VO word timestamps (src/vo.ts, src/vo_words.json) and karaoke lines lit per spoken word; Pricing 10 bars, Store Walk 9, Training 7; Lyria take E (120 BPM conformed to 116, drift 13 ms), take F failed (108.8 BPM, drift 112 ms); SFX cues rebuilt from the VO cues.

## v4 (user feedback 2026-10-25)
Changes: no exact figures in VO or type (hundreds of past estimates, over $100,000 priced, no photo/walk/lesson/page/commit counts); AI tone keeps the team in control ("Our AI team carefully designs each lesson", "our team takes it from there"); client work stays generic ("Same capabilities, for our clients", cards labelled "Client dashboard" etc.); commits and coding-agents lines dropped, Bonus is a months-of-work calendar. Motion: masked word rise replaces the blur fade; problem props build with scan lines on one camera glide, fold into three app tiles, tiles dock above the demos; each chapter window grows out of its dock tile, pushes in on detail, flips to the payoff and folds back; section swaps are hard-edged wipes; capabilities is a perspective card deck. New Puck take (vo_take_v4), SFX rebuilt from the new cues, music take E unchanged.
