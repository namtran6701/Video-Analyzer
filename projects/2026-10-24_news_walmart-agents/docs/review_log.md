# Review log

Scores 1 to 10: hook, phone readability, sound-off, motion, variety, composition, depth, brand/source accuracy, sound sync, polish, voice.

## Round 1 (draft1, half scale)
Scores: hook 8, phone 4, sound-off 7, motion 7, variety 7, composition 5, depth 6, accuracy 8, sound n/a (VO only), polish 6, voice 8.
Worst:
1. Evidence paragraphs fill a third of the frame; text unreadable on a phone (rows 5 to 14).
2. Amazon search page shown full-viewport; red boxes and labels are specks (row 19).
3. Static holds over 2s: "ai agent" card (row 8), "ad nobody saw" card (row 20); card type undersized.
Fixes: regions per capture, two Amazon zooms (Sponsored row, product card), row 8 split into ai agent / very fast / intern, takeaway key phrase keyed to "an", cold-open 11% and takeaway 8.5% of height, bigger log table and swap type.

## Round 2 (draft2)
Scores: hook 8, phone 5, sound-off 7, motion 7, variety 8, composition 6, depth 6, accuracy 8, polish 6.
Worst:
1. Regions only set scale, so neighbouring paragraphs still leaked in and text stayed small.
2. Dark-on-dark stamps ("Blocked in September", "Walmart picks", "same order") read as loose text.
3. Sponsored zoom still loose.
Fixes: clip evidence to its region on a white card, 94% width, `panel` fill for secondary stamps, tighter Sponsored region. Mix built: Lyria 3.5 bed at -12 dB, sidechained 3:1 under VO, SFX -6 dB, -14.1 LUFS, -1.5 dBFS peak.

## Round 3 (draft3)
Scores: hook 8, phone 6, sound-off 8, motion 7, variety 8, composition 6, depth 6, accuracy 9, sound 8, polish 7.
Worst:
1. Clipped cards are thin full-width strips; text still about 2.5x, small on a phone.
2. Adweek headline region cut through the second line (row 1).
3. MCP page crop cut the paragraphs mid-line at the right edge with no clear subject.
Fixes: `around()` zooms (full paragraph height, ~520 px wide centred on the phrase, ~3.5x), Adweek region on the headline, MCP split into title shot then USB-C line shot.

## Round 4 (draft4)
Scores: hook 8, phone 8, sound-off 8, motion 8, variety 8, composition 8, depth 8, accuracy 9, sound 8, polish 8, voice 8.
Remaining nits fixed before final: USB-C crop showed slivers of the lines above and below (row 12); takeaway text up to 10% of height; "loyalty" card held 2.8s with one change, now gets a "switched brands" stamp on "switches".
