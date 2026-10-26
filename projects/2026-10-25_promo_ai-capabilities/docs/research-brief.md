# Sales Factory Internal Tools and Technology Brief (May to Oct 2026)

Source brief for a video showcasing the internal tools and technology Sales Factory built and adopted over the past six months (2026-04-25 to 2026-10-25), and how they boost the team's productivity, capacity and capabilities. AI is one ingredient, not the whole story: the showcase covers custom apps, data pipelines, dashboards, workflow automations and AI working together. Every fact below was pulled from the project repos in `/Users/trannn23/Documents/SF_Work/` (code, docs, git history). File paths are cited so claims can be re-checked. Numbers marked **(estimate)** are not measured; numbers marked **(unverified)** came from a secondary source.

---

## 0. Read this first (rules for the video agent)

1. **Frame it as a tools-and-technology showcase, with AI as one lever.** The video is about how SF works smarter with technology, not an "everything is AI" pitch. The projects group into four capability pillars:
   - **AI-powered apps:** SF Pricing (AI estimating), Store Walk App (AI photo tagging, search and pitch writing), AI Training app (AI upskilling, managed through a Claude connector).
   - **Data pipelines and live dashboards:** Channellock Sales Dashboard (Shopify to BigQuery), IIP POS Dashboard (Heartland POS nightly sync), Paid Team Tableau puller.
   - **Workflow automation:** SEO meta generation (AI), TPP research workflow (AI agents), Tempur Friday report (Python), Salsify Change Digest (catalog monitoring).
   - **Custom client software:** Ifitspaper scheduling app, Review Page Builder (Mando), plus the dashboards above delivered to clients.
   - **The thread through all of them:** every project was built with AI coding agents (Claude Code, `CLAUDE.md` / `AGENTS.md` guides, Claude co-authored commits). That's how a small team ships production software at a pace that used to need a dev shop.
   - Only claim AI inside a product where it actually runs: SF Pricing, Store Walk, AI Training (MCP), SEO meta, TPP workflow. The others are automation, data and software; present them that way.
2. **Never invent time-saved or user-count numbers.** Most repos don't record them. Use the verified numbers in section 2 or label a claim as an estimate.
3. **Do not show on camera:** the AI Training MCP server's Cloud Run URL (it's unauthenticated by design), any `.env` values, API keys, or the shared dashboard logins.
4. **Client work vs internal tools:** Ifitspaper scheduling and IIP POS are built for an outside client, If It's Paper (a 3-store NC stationery retailer). Channellock Sales Dashboard and Salsify Change Digest are for client Channellock. Mando is a client brand; the tool itself is the Review Page Builder. Frame these as "capabilities we deliver to clients."

---

## 1. Portfolio at a glance

| # | Project | What it is | Who it serves | Runtime AI? | Status |
|---|---|---|---|---|---|
| 1 | **SF Pricing** | AI estimator: brief or RFP in, Good/Better/Best priced plan, work order and ClickUp task out | All SF account, strategy, creative leads | Yes (Claude Opus 5.5 + Haiku 5.5 + web search) | Live: pricing.salesfactory.com |
| 2 | **Store Walk App** | Field photo library with AI tagging, plain-English search and AI pitch writing | Field reps, strategists, execs | Yes (Claude Sonnet 5.5 vision + OpenAI embeddings) | Live: storewalk.salesfactory.com |
| 3 | **AI Training app** | Company AI training hub with quarterly lessons per team, run through a Claude connector | Every SF employee, managers | Yes (custom MCP server for Claude) | Live: sf-training.web.app |
| 4 | **Ifitspaper Scheduling** | Staff scheduling PWA for a 3-store retailer | Client: If It's Paper | No (AI-built) | Live (Vercel + Cloud Run) |
| 5 | **IIP POS Dashboard** | Nightly POS sales and margin intelligence | Client: If It's Paper | No (AI-built) | Live: report.ifitspaper.org |
| 6 | **Channellock Sales Dashboard** | Owned Shopify to BigQuery pipeline plus story-driven sales dashboard | Client: Channellock + SF account team | No (AI-built) | Live on Cloud Run |
| 7 | **Salsify Change Digest** | Monthly before/after audit of Channellock's product catalog | Client: Channellock sales team | No (AI-built) | In monthly use |
| 8 | **Review Page Builder (Mando)** | No-code builder for interactive client review pages | SF account and creative teams | No (AI-built) | Working, 2 themes |
| 9 | **Paid Team Tableau Puller** | Pulls the paid-media "CLAUDE SHEET" from Tableau, adds KPIs, serves a quarterly dashboard | Paid media team (Henkel brands) | Feeds AI analysis | Prototype |
| 10 | **Automated Workflow maps** | Before/after maps of 3 automations: SEO meta (AI), TPP insights (AI), Tempur form pull (Python) | SEO, Research, Account teams | Yes for 2 of 3 | Mapped June 2026, in use / testing |

---

## 2. Headline numbers (verified from the repos)

- **SF Pricing adoption (seen in the running app, 2026-10-25):** 44 saved estimates by 17 people across ~20 clients since 2026-07-15, **~$1.57M of work priced**, 13 work orders sent (~$278K).
- **Store Walk adoption (seen in the running app, 2026-10-25):** **1,900 photos across 133 store walks**; October alone had 9 walks by 8 "Shelf Stalkers".
- **~600 commits across 9 git repos in six months**: SF Pricing 155, Store Walk 149, Ifitspaper 140, AI Training 50, Chan Dashboard 37, IIP POS 37, Mando 31, Salsify 1.
- **6 production apps live on company or client domains** (pricing, storewalk, sf-training, report.ifitspaper.org, Ifitspaper scheduling, Channellock dashboard).
- **Ifitspaper:** full multi-role production system (auth, roles, transactional workflows, push, email, scheduled jobs, CI) in **about 12 weeks** (2026-06-26 to 2026-09-16), ~70k lines inserted, 137 of 140 commits by one developer.
- **SF Pricing:** ~246 historical estimating worksheets turned into a searchable corpus that grounds every AI draft; ~976 automated test cases; 334/334 tests passing in the 2026-09-18 audit.
- **Store Walk:** 1,546 historical images across 96 walks imported from Google Drive with 0 failures (`scripts/import.log`).
- **Channellock pipeline:** full backfill of 9,797 orders and 32,513 sale rows in 351 s; daily sync ~50 s; net sales match Shopify **to the cent** (Jan 2025: $23,744.81 vs $23,744.81, 0.00% gap).
- **Salsify digest:** tracks ~604 base SKUs; whole catalog crawl ~40 s; September run caught 25 edits across 16 products that nobody had been notified about.
- **SEO meta automation:** ~300 product pages, **~40 hours of manual writing down to minutes** (from the team's own workflow map, `Automated Workflow/CL_Meta_Automated.html`).
- **AI Training:** 30 active lessons live (19 AI and tools lessons across 5 team tracks + 11 onboarding tasks); Q3 2026 closed, Q4 2026 open.

---

## 3. Cross-cutting story themes

1. **From spreadsheets to systems.** Nearly every project replaced a spreadsheet or a manual export: pricing worksheets, training sheet, store-walk Drive folders, scheduling Excel, monthly POS export, Salsify export, Tableau CSVs, Gravity Forms exports.
2. **AI drafts, code owns the facts.** The strongest apps use a clear pattern: the model writes language (scope, pitch angles, work orders, tags), deterministic code owns the numbers (prices, verdicts, totals). SF Pricing: "deterministic code owns all client-facing dollar amounts" (`SF pricing/AGENTS.md`). Store Walk: "deterministic logic stays local, AI only writes generative text" (`Store Walk App/README.md`).
3. **Institutional memory becomes an asset.** Past estimates ground new ones (SF Pricing project stock). Past store walks ground pitches (Store Walk insights). Training history is preserved per quarter.
4. **Talk to your tools.** The AI Training catalog is managed by talking to Claude through a custom MCP connector. Store Walk has Safa, an in-app AI guide.
5. **Staying current with the AI wave.** Model upgrades are routine: Store Walk moved OpenAI to cheaper tiers in August, then to Claude Sonnet 5.5 in October; SF Pricing moved to Claude Opus 5.5 in October. The training app teaches Claude Design, Claude Motion, Cowork, skills, Gemini Deep Research, AEO.
6. **Built by a small team with AI coding agents.** `CLAUDE.md` / `AGENTS.md` in every repo, Claude co-authored commits, CI/CD with tests on every app. Same quality bar as a software company.
7. **New service lines for clients.** Custom apps, owned data pipelines and dashboards for If It's Paper and Channellock show SF can now deliver software, not just marketing.

---

## 4. Project deep dives

### 4.1 SF Pricing (pricing.salesfactory.com)

**Pitch:** Paste a project brief or attach an RFP. Claude drafts a Good/Better/Best plan with roles, hours and outside costs, grounded in live rates and past SF projects. The team reviews it together, then exports Excel or a Google Sheet, a client work order and a ClickUp task from the same app.

**Before vs after**
- Before: every estimate was a hand-built Excel "Estimating Worksheet" (template in `reference/estimating-worksheet-template.xlsx`, ~246 historical worksheets). Work orders were written by hand (66 signed WO PDFs in `reference/work-orders/`). Rates lived in spreadsheets; review happened over email.
- After: one five-step wizard prices against a live rate card. AI drafts scope and hours. Code computes every dollar. Review, comments and verdicts happen in-app. One click produces the spreadsheet, the work order and the ClickUp task.

**Who uses it:** estimate creators (41 named SF employees in the creator picker), 1 to 10 tagged reviewers per estimate, admins who curate the corpus. Any `@salesfactory.com` account. ~28 known clients pre-suggested (Henkel/Loctite/GE, Channellock, Jerzees, Mando, WD40, Eco Fuego, Polivka...).

**Capabilities**
- *Estimator wizard (Setup, Scope, Labor, Hard Costs, Review):*
  - 8 built-in plan templates (Brand Strategy, Creative Campaign, Packaging, Website, Media, Research, Sell-In, Content & Social) or an AI brief.
  - AI intake: single plan or Good/Better/Best, budget preset or exact target, timeline, deliverables, up to 5 RFP attachments (50 MB each), up to 5 pinned past projects.
  - AI progress panel with 4 stages ("Reviewing your brief", "Matching relevant work", "Drafting scope and effort", "Checking the plan structure") plus a fun fact about the creator's name while waiting.
  - Live Estimate rail: running price, matched historical projects, cited market-estimate card.
  - Scope editing per tier or all tiers, drag-and-drop tasks, client-visible scope labels, tier removal and restore.
  - Labor by billing role at live rates (15% labor discount for large retainers). Hard costs grossed up by category margin.
  - Review: per-item tier choice, discounts and plus-ups with notes, validation checklist, "what the price includes", spreadsheet-style audit grid with cell notes, reviewer strip with check/cross marks and "Out of date" flags, comment thread.
- *Exports:* Excel with live formulas over a Rates tab; Save to Drive as a native Google Sheet; AI work order (editable, regenerable, Letter print) pushed to ClickUp with owner, assignees and Sheet link.
- *Saved-estimates portal:* team-wide table (All, Mine, To review), statuses Draft, In review, Reviewed, W/O Sent; mobile card layout.
- *Review loop:* Gmail notifications for requests, verdicts, re-requests and comments; verdicts go stale automatically when the price drifts.
- *Pricing admin:* live editors for Billing Rates, Cost Categories, Services. **Project Stock tab:** shipped estimates get merged into the corpus that grounds future AI drafts (a learning loop).
- *Product ops:* in-app "what's new" announcement video at sign-in, bug/idea reports with screenshots straight to ClickUp, What's New dialog fed live from the ClickUp roadmap. Responsive on phone and tablet.

**AI under the hood** (`server/generate-plan.js`, `server/market-scan.js`, `server/generate-work-order.js`)
- **Plan generation:** Claude Opus 5.5, adaptive thinking, streaming, prompt caching. Prompted as a "senior pricing analyst at Sales Factory" with live roles, rates and service anchors. **Agentic two-pass tool loop:** Claude calls a `price_plan` tool; server code prices the draft with live rates and returns totals, budget fit and validation issues; Claude revises and submits the final plan. RFPs are read through the Anthropic Files API as primary source.
- **Retrieval of past work:** Claude Haiku 5.5 picks up to 5 relevant past SF projects from the corpus by type of work and injects them as calibration examples.
- **Market scan:** Claude with web search (up to 5 searches) finds open-market prices and returns a cited low/high range. Advisory only, never enters the math.
- **Work-order writer:** turns scope into client-facing title, summary, deliverables, exclusions, timeline and billing, in a voice calibrated on historical signed SF work orders. Never sees rates or hours; never invents dollars.
- All calls traced in LangSmith.

**Stack:** React 18 + TypeScript + Vite, Express 5, Google Cloud Run, Firestore, Cloud Storage, Firebase Auth, Google Drive API, Anthropic API, LangSmith, ClickUp, Gmail, ExcelJS. GitHub Actions CI/CD with coverage-gated tests.

**Gains**
- One brief replaces 5 separate manual artifacts (spreadsheet, work order, review emails, Sheet, ClickUp task).
- Pricing consistency: rates applied by code, reopened estimates reprice against the current rate card.
- Historical pricing know-how (~246 worksheets) now informs every new estimate, and the corpus grows from shipped work.
- External sanity check on every estimate via the cited market scan.
- Time saved per estimate: not measured **(any "hours to minutes" claim is an estimate)**.

**Timeline:** 07-01 first commit; 07-05 AI Good/Better/Best plans; 07-09 RFP attachments + CI/CD; 07-12 review workflow + AI work orders; 07-17 ClickUp; 07-24 Save to Drive; 07-28 seven tutorial videos recorded; 08-24 AI market scan; 09-18 Google Sheets export + full audit; 09-28 mobile, drag-and-drop, live-formula Excel; 10-04 cell notes + Project Stock loop; 10-09 moved to Claude Opus 5.5; 10-13 sign-in announcement video.

**Video-worthy moments**
1. Brief + RFP in, four-stage AI progress, Good/Better/Best compare cards appear (`src/components/setup/SetupStep.tsx`, `CompareCards.tsx`; scripted demo `recordings/scripts/04-ai-draft.mjs`).
2. Live Estimate rail ticking up next to the cited market card (`src/components/shell.tsx`).
3. Review grid: cell note, reviewer check marks, "Out of date" flag after a price change.
4. One click to deliverables: Excel, native Google Sheet, AI work order printed client-ready, ClickUp task.
5. The learning loop: a shipped estimate merged into Project Stock.
6. **Ready-made footage:** 7 scripted 1280x800 demo videos in `SF pricing/recordings/videos/` (July UI; re-record with `recordings/scripts/*.mjs` for the current UI).

**Verified in the running app (2026-10-25, local with auth bypass, read-only):**
- Saved-estimates portal: 44 estimates, 17 owners, ~20 clients (IPEX, Primo Water, Loctite, GE, Henkel, Keter, Spiffy, Gateway, Action Greensboro, Z.V. Pate, Chandler Foods...), statuses 19 Draft / 10 In review / 2 Reviewed / 13 W/O Sent, ~$1.57M total priced. Largest: Q4 Pro Media Test ($134K), Keter Fencing Launch ($106K).
- Review screen on "Data Center Catalog" (IPEX) shows the three tiers side by side: Good $58,145 / Better $72,553 / Best $85,192, with the reviewer list and check marks.

**Next:** transactional saves, work-order billing-line guard, rate limits on AI routes, E2E suite, ClickUp task refresh on edits.

---

### 4.2 Store Walk App (storewalk.salesfactory.com)

**Pitch:** An installable app that turns field reps' store-walk photos into a searchable, AI-tagged retail evidence library. Claude then writes a client-ready pitch angle for any brand from what the team actually saw on the shelf.

**Before vs after**
- Before: photos in a Google Drive tree ("2026 STORE WALKS"), competition points in a separate form export, evidence "across camera rolls, emails, spreadsheets, and one-off notes" (`docs/PRODUCT-OVERVIEW.html`).
- After: one guided upload per walk; every photo filed by store, date, subject and brand, searchable in plain English, rolled up nightly into brand-level evidence, and turned into a pitch POV in one click.
- Ranked goal (`CLAUDE.md`): 1) prospecting with observed retail evidence as a pitch wedge, 2) strengthening existing client relationships.

**Who uses it:** field reps and walkers, strategists, account teams, executives, admins. Covers Big Box (Lowe's, Home Depot, Walmart, Target), Co-ops (Ace, True Value, Do it Best), Pro (Graybar, Ferguson), Industrial (Grainger, Fastenal, MSC), Farm (Tractor Supply, Fleet Farm, Rural King).

**Capabilities**
- *Guided aisle walk:* an animated character walks a drawn aisle through 6 stops (Main Product, Competitor with rivals outlined in red, Price & Label, Packaging, End Cap, General with a store floor map). Each stop has tips, a framing checklist, a panning camera, and a strip of captured photos; a "receipt" shows stops covered x/6.
- *Store pick* via Google Places (nearby or search), retailer channel auto-detected.
- *Photo handling:* HEIC to JPEG on the server, direct uploads up to 20 MB, automatic thumbnails.
- *AI "suggest metadata":* fills subject, condition chips (Empty Facings, Out of Stock, Clip Strip, Lower Price, Stands Out...) and brand tags, never overwriting what the rep typed.
- *Gallery:* filters (date, brand, retailer, state, rep, subject), **plain-English semantic search** ("endcap with sale tags", up to 100 ranked results), viewer with edit/re-suggest/download/delete, bulk ZIP and bulk delete.
- *Timeline:* monthly walk and photo volume, KPIs, coverage, cadence, contributors, **quarterly competition leaderboard** (Big Box 10 pts, Co-ops 20, Pro/Industrial/Farm 30, +10 client shot, +10 competitor shot).
- *Insights:* one card per brand with Evidence Footprint (stores, photos, walks, walkers, states), Signals Logged (expandable to proof photos), deterministic verdicts (shelf execution concern, pricing/signage concern, competitive observation, packaging concern, positive signal) with a next move and priority, and a **Generate pitch** button (POV + one-line opener). Flags "Evidence updated, regenerate" when new photos arrive.
- *Guide:* 11 video tutorials plus **Safa**, an AI assistant that answers "how do I" questions from the guide only, deep-links the right page and opens the right tutorial.
- *Admin:* user approval and roles, maintenance mode, announcement video, feedback inbox with screenshots.
- *Platform:* installable PWA on iOS and Android, particle-field login.

**AI under the hood**
- **Claude Sonnet 5.5** for four jobs (`src/lib/anthropic.ts`): 1) vision tagging of up to 12 photos per batch with evidence-only rules, 2) retrieval captions per photo, 3) pitch narrative from deterministic stats with guardrails (no invented stores, dates, sales or share claims), 4) the Safa guide assistant.
- **OpenAI `text-embedding-3-small`** for 1536-dim vectors; Firestore native vector KNN search.
- **Nightly automations** (GitHub Actions, 06:00 UTC): caption + embed new photos; BigQuery brand rollup refreshes the insights cache.
- Model history shows cost discipline: OpenAI vision at launch, cheaper gpt-5.6 tiers on 2026-08-15 (commit notes "3.75x cheaper"), Claude Sonnet 5.5 on 2026-10-13.

**Stack:** Next.js 15, React 19, TypeScript, Tailwind, Firebase (Auth, Firestore, Storage, App Hosting), 3 Firestore-to-BigQuery streams, BigQuery, Secret Manager, Google Places, Drive API, Anthropic, OpenAI, Recharts. 54 test files, CI on every PR.

**Gains**
- 1,546 historical images and 96 walks backfilled with 0 failures; ~95 historical competition rows imported.
- Reps stop hand-typing tags; AI pre-fills them per batch.
- Finding evidence goes from browsing Drive folders to one plain-English query.
- Brand pitch POV generated on demand from live evidence. Internal tagline "Pitch-ready before lunch" (marketing line, not measured).
- Built for 100k+ photos.
- **Live (seen in the running app 2026-10-25): 1,900 photos across 133 store walks.** The older promo video used 1,840 photos / 124 walks / 85 stores / 108 brands; use the newer numbers.

**Verified in the running app (2026-10-25, local with auth bypass):**
- Timeline: October 2026 had 9 walks, 60 photos, 5 stores, 8 walkers (the leaderboard calls them "Shelf Stalkers"). Walk notes are real field observations, e.g. "This GE foam end cap has been here for about a year with no rotations... It's always full" (Walmart, Zebulon NC).
- AI Insights for Channellock: 15 stores, 56 photos, 18 walks, 16 walkers, 2 states, evidence strength STRONG. The AI pitch angle flags low stock and empty facings at 6 stores (42% of the concern photos at Tractor Supply). The generated opener: "We'd love to talk about keeping Channellock's strong in-stock look consistent from store to store..." Other brands on the page: Hanes, DAP, Loctite, GE.
- Semantic search "end cap display with sale price tags" returned 100 ranked matches: Target "deal days" signage, Home Depot end caps, Tractor Supply displays.

**Timeline:** 05-24 first commit; 06-12 AI Insights page; 06-14 AI metadata suggestions; 06-16 Safa assistant; 06-19 competition leaderboard; 06-20 to 06-23 semantic search, BigQuery streams, nightly rollup; 06-25 guided aisle walk; 06-29 tutorials + feedback; 08-15 model tiering; 09-11 to 09-18 installable PWA + mobile pass; 10-13 Claude Sonnet 5.5 + announcement video.

**Video-worthy moments**
1. Guided aisle walk animation with the zooming camera and red competitor outlines (`src/components/gallery/GuidedWalkPanel.tsx`; clip `public/guide-videos/05-guided-storewalk-upload-flow.mp4`).
2. AI fills tags across a batch of shelf photos.
3. Plain-English search returning ranked photos (clip `01-gallery-search-viewer.mp4`).
4. Insights card: signal expands into proof photos, then Generate pitch writes the POV (clips `03-insights-signal-drilldown.mp4`, `07-insights-brand-selection.mp4`).
5. Leaderboard race (clip `02-timeline-leaderboard.mp4`).
6. Ask Safa "How do I add a new walk?" and the tutorial opens.
- **Reusable assets:** a finished 90 s promo at `SF_Work/Store Walk Video/out/final.mp4` with `docs/shotlist.md`.

**Next:** re-caption on metadata edits; ideas backlog includes flagging new SKUs, empty hooks, 30-day price drops, regional comparisons.

---

### 4.3 AI Training app (sf-training.web.app)

**Pitch:** Sales Factory's internal AI training hub. Every employee gets a quarterly checklist of hands-on AI lessons for their team, managers see who is keeping up, and the whole catalog can be managed by talking to Claude through a custom MCP connector.

**Before vs after**
- Before: training lived in a Google Sheet behind Apps Script with email-and-PIN login, no real identity, no per-team structure, no quarter history. Curriculum changes meant editing a spreadsheet.
- After: React + Firebase app, Google sign-in locked to `@salesfactory.com`, server-enforced roles, per-team tracks, quarterly publish/close with frozen history, built-in new-hire onboarding. A manager can say "add a Q4 creative assignment" to Claude and it lands in the live catalog with an audit log entry.

**Who uses it:** all employees; new hires (fenced to Onboarding until assigned a team); track managers (own one team); master manager (everything). Tracks: Foundations, Insights & Analytics, Creative, Digital Marketing, Marketing Strategy, Onboarding.

**Capabilities**
- *My Training:* "Your Training Hub" hero, required/total/in-progress stats, progress bar, quarter banner with due date, collapsible color-coded track groups, lesson cards with status menu, search, lesson detail with Google Workspace smart buttons ("Google Sheets: Open spreadsheet"), subscribe to other teams' tracks, manager reordering, "You got it done." completion notice.
- *Quarter archive* for closed and upcoming quarters.
- *Team Progress:* per-track Members, Avg Done %, Fully Done; per-person table with Last Active; quarter picker with frozen snapshots ("These numbers no longer change.").
- *Lessons admin:* create/edit/archive/restore/delete lessons by type (Video, Article, Assignment, Tool, Resource); shared General lessons teams can opt into.
- *Team admin:* roster, roles, deactivate; per-person drilldown; new-hire "Ready" badge and one-click promotion to a team.
- *Settings:* due dates; **Publish Q{n}** rolls the whole company into the next quarter in one batch write (everyone starts at zero, old quarter archived).
- *Governance:* append-only audit log of every change.

**Live curriculum (Q4 2026), examples:** Getting Started with Claude Design; Bring Your Favorite Thing to Life with Claude Motion; Give Your Favorite Thing a Soundtrack (Gemini music); Getting Started with Claude Cowork; Let Claude Do the Reporting Heavy Lifting; Gemini Deep Research for Emerging Trends; Build a Trend Page with Claude & Sales Factory Design; ClickUp Brain Overview; How to Use Skills in Claude and ChatGPT; Custom GPTs Are Retiring: How to Migrate to Plugins; Skill Authoring Best Practices; AI-Generated Dashboards; Optimizing for Google's Generative AI features; "When AI Answers First, Will Customers Find Our Clients?"; Granola AI; Convert Your Landing Page to PDF or PowerPoint with Skills.

**AI under the hood**
- **`sf-lesson-mcp`**, a remote MCP server on Cloud Run that plugs into Claude as a custom connector. 9 tools: `list_quarters`, `list_lessons`, `get_lesson`, `create_lesson`, `edit_lesson`, `archive_lesson`, `restore_lesson`, `delete_lesson` (archive-first, confirm required), `set_lesson_assignment`. Tool descriptions steer Claude ("call this before edit_lesson so you can see current values instead of guessing"). Reuses the app's business rules and writes audit logs.
- The app itself makes no LLM calls: AI is the subject being taught, and the admin surface is AI.

**Stack:** React 18, Vite 6, React Router 7, Firebase Auth + Firestore, Firebase Hosting, Cloud Run (MCP), GitHub Actions CI/CD, ~66 unit tests + ~97 security-rules tests.

**Gains**
- Company-wide AI upskilling on a quarterly cadence, measurable per person and per team.
- Team-specific AI skills: Creative (Claude Design, Motion, AI music), Digital (AEO, Cowork reporting), Insights (AI dashboards, skill authoring), Strategy (Granola, the pricing app, skills), Foundations (Deep Research, ClickUp Brain, Claude/ChatGPT skills).
- Curriculum maintained by conversation instead of spreadsheet edits.
- Standardized onboarding (11 tasks, Ready signal, one-click promotion).
- Completion rates and user counts are not in the repo; get them from the owner if needed.

**Timeline:** 07-02 starts as a spreadsheet tracker; 07-04 Google sign-in; 07-08 Firebase rebuild + CI/CD; **07-09 Claude MCP server shipped**; 07-11 rules test suite; 07-21 onboarding track; 07-24 `get_lesson` tool + audit logging; 09-30 quarters, publish/close flow, `list_quarters` tool, new-hire fencing.

**Video-worthy moments**
1. In Claude: "Add a Q4 Creative assignment on Claude Motion" → Claude calls `list_quarters` then `create_lesson` → cut to the lesson appearing in My Training. (Hide the connector URL.)
2. My Training hero filling up as a lesson is marked Complete, ending on "You got it done."
3. Team Progress cards, switch to Q3 2026 frozen snapshot.
4. Publish Q{n}: one click moves the whole company to the next quarter of AI training.
5. New-hire "Ready" badge → Assign track.

**Verified in the running app (2026-10-25, emulators seeded with the real catalog + fictional staff):** dark Sales Factory theme with lime accents; "Your Training Hub / Hi Demo" with Required complete 2/2 and the "You got it done." banner; Foundations lessons with Completed pills; Team Progress grouped by track (Members, Avg Done, Fully Done, per-person progress bars) with a quarter picker; Lessons admin table listing the real catalog by track, quarter, type and status with "+ New Lesson"; Settings with due date and the Quarter panel (Current Q4 2026, 1 closed, "Create Q1 2027"). Demo people are fictional, safe to film.

**Next:** Stage 2 MCP with per-caller OAuth; Q1 2027 lesson set.

---

### 4.4 Ifitspaper Scheduling (client: If It's Paper)

**Pitch:** A tailored scheduling app that moved a three-store stationery retailer (Greensboro, Raleigh, Winston-Salem) off manager spreadsheets and text threads. Owners build and publish weekly schedules with automatic conflict checks; employees see shifts and file requests from their phones.

**Before vs after**
- Before: hand-built Excel schedules (real ones in `src/fixtures/rdu-july-2026.xlsx`), time off and swaps negotiated by text. Owner's goal: "make a correct schedule faster, with fewer mistakes, fewer text messages, and less back-and-forth" (`local/app-note.md`).
- After: one grid with automatic checks for availability, overlaps, time off, overtime and store hours; draft-then-publish with push notifications; in-app requests with transactional approvals; a monthly availability cycle with automatic reminders.
- Buy vs build: compared with Homebase ($90 to $360/month for 3 stores) and When I Work (~$150/month for 30 users); custom build "likely near $0/month" to run **(estimate, from a 2026-06-28 analysis)**.

**Who uses it:** owner (all stores, reports, access), managers (their stores), ~30 employees across 3 stores.

**Capabilities**
- *Scheduling:* desktop week grid, phone day board, open-shift lane, drag-and-drop, copy/paste, repeat across week, shift presets, store templates, copy last week. Shift editor checks staffing windows, overlaps, availability, approved time off and overtime; the picker shows only free staff. Draft edits show dashed until "Publish week" pushes to affected employees. Print-ready weekly calendars.
- *Dashboard:* today at a glance, who's on the floor, schedule health, overtime risk, pending requests.
- *Reports:* fill rate, scheduled hours, hours heatmap by store and day, employee load.
- *Team:* review queues for time off, coverage and availability; next month's availability board (Not submitted, Awaiting review, Approved).
- *Employee self-service:* My Schedule, who can work, time off (full, multi-day, partial), monthly availability, coverage requests.
- *Workflows:* time-off approval opens affected shifts in one transaction; availability approval removes uncovered shifts with reassignment to re-verified coworkers; stale coverage requests close themselves.
- *Monthly availability cycle:* due the 20th at 6pm, reminders on the 18th and 20th via Cloud Scheduler.
- *Access:* email-link invites, offboarding, access history; web push (FCM); email via Microsoft Graph from the client's own domain; in-app feature requests with images; installable PWA.

**AI:** none in the product (auto-fill is a deterministic scoring heuristic, currently parked). Built with AI coding agents (`AGENTS.md`, `CLAUDE.md`, Claude-authored commits) and auto-generated Playwright tutorial videos.

**Stack:** React 19, Vite 8, PWA on Vercel; FastAPI on Cloud Run; Firebase Auth, Firestore (16 collections), Storage, FCM; Cloud Scheduler; Microsoft Graph; GitHub Actions with Workload Identity; 89 pytest + ~88 Node tests.

**Gains:** production multi-role system in ~12 weeks by essentially one developer; SaaS fees avoided **(estimate)**; errors caught before publishing; availability collected automatically; employees notified automatically.

**Timeline:** 06-26 first commit; 07-14 Firestore + auth + print; 07-30 templates, open shifts, real-week fixtures; 08-11 installable PWA + invites; 08-27 requests, push, writes moved to Cloud Run API, CI; 09-07 monthly availability + reminders; 09-09 draft-and-publish; 09-16 client-domain email.

**Video-worthy moments**
1. Split screen: the client's Excel schedule vs the same week in the color-coded grid.
2. Dashed draft shifts → "Publish week" → phone buzzes "Schedule published".
3. Shift editor live warnings and the free-staff picker.
4. One-tap time-off approval flipping shifts to open.
5. Availability board + reminder on the 18th.
6. Hours heatmap, then the app on a phone home screen.

**Verified in the running app (2026-10-25, emulators with demo seed data, owner auto-login):** week grid "Week of October 19" with store filter (All stores, Greensboro, Raleigh, Winston-Salem), open-shift lane and color-coded shifts; Dashboard "Today at a glance" (scheduled today, needs review, open shifts, 130 scheduled hours, on the floor per store, schedule health, off target); Reports with the hours-by-store-and-day heatmap, fill rate 100%, store share of the week; Team queue with time-off requests and one-click Approve/Deny. Demo data is fictional, safe to film.

**Next:** public custom-order booking from the client's Shopify site using published schedules (draft plan, `local/plan-public-booking.md`).

---

### 4.5 IIP POS Dashboard (client: If It's Paper, report.ifitspaper.org)

**Pitch:** A nightly-synced sales intelligence dashboard that turns raw Heartland Retail POS data from three stores into revenue, margin, vendor and product insight for any date range.

**Before vs after:** monthly spreadsheet exports (`reports/IIP Monthly Report Nov 2025.xlsx`) → nightly automatic sync, any range from Jan 2025, prior-period and year-over-year comparisons.

**Who uses it:** the If It's Paper owner and staff (one shared login).

**Capabilities**
- Presets (MTD, last month, last 30 days, QTD, YTD, custom), range stepping, prior-period or YoY comparison, store filter.
- *Revenue:* interactive North Carolina store map, store cards with photos, postage-stamp art and sparklines, contribution waterfall, month bridge, weekday averages.
- *Profitability:* blended, stock and custom-order margin; margin-rate bridge split into product-mix and stock-rate effects; margin distribution with at-or-below-cost sales flagged.
- *Vendors:* concentration curve, treemap, gainers and decliners.
- *Products:* gainers, decliners, rank changes, search, sorting by units, cost, profit, margin.
- Phone and tablet layouts that change shape, "Open the envelope" sign-in, outdoor-ad hero video.

**AI:** none at runtime (stdlib Python + React). Built with Claude Code (Claude co-authored commit, vendored UI skills).

**Stack:** Heartland Retail API, Python stdlib sync with retry, Cloud Run Job + Cloud Scheduler (01:00 ET), Cloud Storage, Cloud Run nginx with auth, Secret Manager, Cloud Build, React 19 + Vite 7 + Tailwind 4.

**Gains:** unattended nightly refresh; self-serve analysis replaces a monthly spreadsheet; margin split into custom vs stock work, which the old report couldn't show. Hours saved not measured.

**Timeline:** 08-26 dashboard + NC map; 08-27 waterfalls, margin sources; 09-02 Heartland sync, comparisons, mobile, Google Cloud deploy; 09-03 sign-in; 09-09 live.

**Video-worthy moments:** "Open the envelope" sign-in → hero video; NC map with three stores; postage-stamp store cards; margin bridge explaining why margin moved; 01:00 nightly job → live site.

**Verified in the running app (2026-10-25, local data on disk, which ends in Aug 2026):** "Sales Performance" masthead with a calendar reporting-period card; Aug 2026 net sales $160,125 (-2.8% vs Jul), 14,984 units; NC map with store contribution Greensboro 45%, Raleigh 43%, Winston 12%; margin bridge showing margin rate 68.5% → 70.1% (custom mix -8.8 pts, stock margin +10.4 pts). Client figures: get permission or blur them.

**Related:** `SF_Work/IIP Site` is SF's Shopify theme work for the IIP storefront.

---

### 4.6 Channellock Sales Dashboard (client: Channellock)

**Pitch:** A private, story-driven sales dashboard for Channellock's Shopify store, fed by a pipeline Sales Factory owns (Shopify → BigQuery, refreshed daily), with numbers that match Shopify's own reports to the cent.

**Before vs after**
- Before: read from a shared Improvado-loaded table that was missing 45 orders, held only 53 orders for all of 2024, and had no customer, address, discount, channel or sessions data.
- After: SF-owned sync (Shopify Admin API → Cloud Run Job → BigQuery), history from 2024-01-01, five tables, exact match with ShopifyQL. Improvado dependency removed 2026-09-18.

**Who uses it:** Channellock stakeholders and the SF account team.

**Capabilities**
- *Overview:* metric picker, Pace chart, "What changed", "Where total sales went" waterfall.
- *Traffic ("Who came, and who bought"):* visit-to-purchase funnel on human sessions only, referrer sources with logos (Google, **ChatGPT**, Meta, TikTok, Reddit), "Which sources pay", landing pages, devices.
- *Customers:* new vs repeat, return curve, "When orders come in" heatmap, repeat value.
- *Geography:* US state grid. *Products:* top products, category mix, "Who climbed, who slipped". *Baskets:* cart value, items bought together. *Operations:* channels, status, most-returned products.
- *Promotions:* marketing's 2025 and 2026 promo calendar coded in, "Lift vs cost" scorecard with a verdict per promo, including the Free Shipping Threshold Test ($85 → $80 → $75).
- Data freshness health check, 3D "Break the seal and open the toolbox" sign-in, hero video.

**AI:** none at runtime. Built with Claude Code (5 commits co-authored by Claude Opus); Google Cloud design checked against official docs before building.

**Stack:** React 19, Vite 7, Tailwind 4, hand-built SVG charts; FastAPI; Shopify GraphQL bulk ops + ShopifyQL; BigQuery; Cloud Run service + job; Cloud Scheduler 06:00 ET; Secret Manager; Cloud Build.

**Gains (measured):** full backfill 9,797 orders / 32,513 sale rows in 351 s; daily sync ~50 s; idempotent re-runs; warehouse 12.5 MB (0.12% of BigQuery free tier); exact match to Shopify (0.00% gap). New capabilities: YoY from 2024, customers, geography, discounts, channels, sessions, promo ROI.

**Timeline:** 09-14 first dashboard; 09-15 toolbox sign-in, backend, CI/CD; 09-17 SF-owned sync; 09-18 six sections; 09-23 funnel + baskets; 09-24 referrers, heatmap, return curve; 09-25 promotions lift vs cost; 10-01 new masthead.

**Video-worthy moments:** toolbox sign-in; "$23,744.81 = $23,744.81, 0.00% gap"; funnel with ChatGPT showing up as a traffic source; promotion scorecard verdicts; 50-second daily pipeline diagram.

**Verified in the running app (2026-10-25, local against live BigQuery):** Oct 1 to 24, 2026 shows $108,374 total sales, 764 orders (+201% YoY), $156.85 average order (+75%), net sales $104,905 (+377% vs Oct 2025). "What changed" attributes +$75.8K to the CHANNELLOCK 140th Anniversary Set. Traffic: Search share up 62% YoY. These are client figures: get Channellock's OK before showing them, or blur the numbers.

**Next:** margin/COGS once product costs exist in Shopify; inventory on hand.

---

### 4.7 Salsify Change Digest (client: Channellock)

**Pitch:** A monthly automated check of Channellock's whole Salsify product catalog that shows exactly which copy, bullets, attributes and images changed, before and after side by side, so the sales team stops finding out late.

**Before vs after**
- Before: "Content editors change bullet points and images directly in the Salsify UI. Saving triggers no notification to anyone. Sales finds out late or not at all." (`PLAN.md`). Salsify's API never supplies before/after values.
- After: one command snapshots every in-scope product; a second builds a Channellock-branded report with month picker, summary numbers, filters and before/after for every change including image thumbnails. Delivered as PDF (`output/pdf/Chan-Salsify-September.pdf`).

**Capabilities**
- *Snapshot:* pages the Salsify API, filters Active/Inactive, drops Case/Inner/Pallet variants (with the reason logged), resolves image files to etag, size, dimensions, filename.
- *Diff engine:* sorts changes into Bullet, Copy, Image, Attribute; makes stray whitespace visible; detects image swaps, in-place replacements and removals; collapses shared image changes; explains SKUs entering/leaving scope.
- *Report:* summary numbers (edits, products changed, image changes, scope changes), filters, per-product cards with version jump and before/after.
- *Research that avoided false alarms:* proved `salsify:version` bumps even on edit-then-revert, so the tool compares content, not version counters.

**AI:** none at runtime (Python stdlib, rules-based). Built with Claude Code.

**Gains (measured):** ~604 base SKUs tracked; whole 2,401-product catalog crawled in ~40 s; September run caught 25 edits across 16 products (6 image changes, 1 scope change), including a bulk tariff-code change on the locking-plier line and new In-Use images, none of which anyone had been notified about.

**Timeline:** 08-31 baseline snapshot and diff engine; 09-04 second snapshot; 10-02 branded report, September PDF, runbook.

**Video-worthy moments:** the "no notification" quote; terminal snapshot run; report hero with 25 / 16 / 6 / 1; 812W wrench before/after card; tariff-code catch with the trailing-space marker.

**Next:** scheduled run with email/Slack delivery; image version archive.

---

### 4.8 Review Page Builder (started as the Mando creator review)

**Pitch:** A no-code builder that turns a client name, logo and a set of videos or images into a branded, interactive review page. The client watches each option, marks it Select or Not interested, and sends the picks straight back to the SF team.

**Before vs after**
- Before: each client review was a hand-built page or static PDF ("email us the creators you'd like to move forward with", `output/pdf/mando-creator-aug-4.pdf`).
- After: an account person fills a form, uploads media, watches a live preview, clicks Download ZIP. The page runs offline; picks return as structured Selected/Rejected lists via a salesfactory.com form, with email and Gmail fallbacks. It became a template because "people liked it" (handoff notes).

**Capabilities**
- Two presets: **Creator Review** (creator shortlist with sample videos) and **Creative Review** (concepts, designs, video cuts).
- Two themes: Sales Factory and **Channellock** (co-branded colors, font, logo and recipients auto-filled).
- Live preview that updates while videos keep playing; guard rails (recipient must be `@salesfactory.com`, required fields before download).
- Client page: hero with paired logos, stat chips, video/image cards, lightbox, Select/Not interested with counter, "Send Your Picks" → "Picks sent".
- Fully offline ZIP (bundled React and fonts, ~1.7 MB, 19 files in the verified test).

**AI:** none at runtime. Built with Claude Code (`CLAUDE.md`, handoff document).

**Gains:** a one-off hand-coded page became a reusable form-driven tool any team can use; client responses moved from free-form email to structured lists. Build time per page not measured **(estimate: developer hours to minutes)**.

**Timeline:** 07-01 Mando creator page; 07-02 hosted videos + selection flow; 07-07 reject option; 07-10 and 08-04 PDF versions; **08-13 turned into the reusable builder**; 08-19 lightbox; 09-17 Channellock theme + form submission.

**Video-worthy moments:** theme flip from Sales Factory to Channellock re-skinning everything; live preview while typing; Download ZIP → double-click offline; client marking picks → "Picks sent"; static July PDF next to the interactive page.

---

### 4.9 Paid Team Tableau Puller

**Pitch:** A small Python tool that pulls the paid-media "CLAUDE SHEET" view straight from Sales Factory's Tableau Cloud, adds CTR, CPM and CPA, and serves a local 2026 quarterly dashboard. Built to feed clean paid-media data into AI analysis and QBR prep.

**What's there** (`SF_Work/Paid Team/`)
- `tableau_pull.py`: signs in to Tableau Cloud with a personal access token, lists workbook views, downloads the view as CSV, appends CTR, CPM, CPA, and rolls up spend, impressions, clicks and conversions per quarter for 2026. `--serve` runs a local dashboard API (`/api/quarterly`).
- `dashboard.html`: "2026 Quarterly" card dashboard (spend per quarter with KPI rows and up/down chips, light and dark mode).
- `claude_sheet.csv`: 1,435 rows covering Henkel brands **GE Sealants, Loctite, OSI**, 2023 to 2026, across Google, YouTube, Meta, Reddit, GumGum, StackAdapt, The Trade Desk, Home Depot, Lowe's and Walmart, by objective (Awareness, Consideration, Conversion), retailer, tactic and audience.
- `henkel_slide.pdf`: Q2 2026 Paid Media QBR ("ACA Paid Media Strategy: driving growth from national brand awareness to retail conversion").

**AI:** the Tableau view is literally named "CLAUDE SHEET": a dataset shaped for Claude to analyze. The script itself makes no model calls.

**Gains:** removes manual Tableau export and KPI math before every QBR; one command refreshes the numbers **(no time data)**.

**Status:** prototype from Sep 1 to Oct 8, 2026; no commits yet.

**Video moment:** one terminal command pulling live paid-media data, then the quarterly KPI cards.

---

### 4.10 Automated Workflow maps (three before/after automations)

Three interactive before/after process maps, made in June 2026 to document automations (`SF_Work/Automated Workflow/`). Each shows manual steps, pain points (red) and automated or AI steps (teal or purple).

**A) SEO Meta Content Generation** (`CL_Meta_Automated.html`, owners Emily & Thomas, 2026-06-25)
- Before: open each product page (~2 min), read content (~2 min), hand-write meta title (~2 min) and description (~2 min), repeat ~300 times: **~40 hours**.
- Now: one kickoff → crawl the full product library (seconds) → **AI analyzes each page and generates an SEO meta title and description** (seconds per page) → meta content for ~300 products **in minutes**.
- Strongest single before/after number in the portfolio (from the team's own map).

**B) TPP Insights Activation** (`TPP_Automated.html`, owner Dominic Mercurio, v1.1, 2026-06-09)
- Trade ProPulse research workflow from request to delivered insights.
- AI already in the loop: **ClickUp agent drafts the first survey**, a **QuestionPro agent** programs the approved survey, a **custom GPT** turns the response Excel + business objective into insights, and an automation updates the **master TPP doc and the Gemini Gem / Claude** knowledge base.
- To-be design: structured brief intake form, a new **AI-assisted public-data gut-check**, and automated QuestionPro-to-Drive export removing two ~5-minute manual steps per survey.

**C) WordPress Form Pull Automation for Tempur-Sealy** (`Tempur_Automated.html`, owners Thomas Conrad / Nam Tran, 2026-06-16)
- Before: every Friday, log into Gravity Forms, export the "Find Rep" form, XLOOKUP zip codes against a 100K-row sheet, look up Canadian postal codes by hand, clean columns, attach to ClickUp, hand to Jenna, forward to the client Monday.
- Now: a **Python script runs every Friday at 8am**, pulls entries from the Gravity Forms API, resolves US and Canadian zip codes, formats the file and emails it. In a testing phase; once accuracy is confirmed it goes straight to the client.

**Video moment:** the animated flowchart flipping from a red, looping manual process to a short teal automated one; "~40h → minutes" as a title card.

---

## 5. Video plan: 90 to 120 seconds

**Goal:** show the AI-powered capabilities of our internal apps, how they boost productivity, and how they raise the organization's AI knowledge. **Not** a tour of all 10 projects.

**Budget:** ~110 s total, ~250 to 280 words of narration (about 150 wpm). Three hero apps get real screen time; everything else is a fast montage.

| Time | Beat | What's on screen | Proof point (verified) |
|---|---|---|---|
| 0 to 8 s | **Cold open: the before** | Excel estimating worksheet, Drive folder of store photos, a 40-hour task list | "Spreadsheets. Folders. Friday exports." |
| 8 to 33 s | **Hero 1: SF Pricing (AI that prices work)** | Brief + RFP in → four-stage AI progress → Good/Better/Best cards → work order + ClickUp task | 44 estimates, 17 people, ~$1.57M of work priced since July |
| 33 to 58 s | **Hero 2: Store Walk (AI that sees the shelf)** | Guided aisle walk → AI fills photo tags → plain-English search "end cap with sale tags" → Generate pitch | 1,900 photos, 133 walks, AI pitch angle from 15 stores |
| 58 to 80 s | **Hero 3: AI Training (AI that teaches the team)** | Claude creates a lesson via the MCP connector → it appears in My Training → Team Progress by track → "You got it done." | Quarterly hands-on AI lessons per team (Claude Design, Motion, Cowork, Gemini Deep Research, skills) |
| 80 to 95 s | **Automations montage** | SEO meta flowchart flipping red → teal; Friday 8am report email; TPP AI agents | **~40 hours → minutes** for ~300 product pages |
| 95 to 105 s | **Built-with-AI flash montage** (1 to 2 s each) | Channellock dashboard, IIP NC map, Ifitspaper schedule, Salsify diff, review page builder | ~600 commits, 6 live apps in 6 months |
| 105 to 115 s | **Close** | Logo + line | e.g. "Built by our team. Powered by AI. Getting smarter every quarter." |

**Cut list (don't give these their own beat):** Paid Team puller, IIP POS, Salsify, Review Page Builder, Ifitspaper, Channellock dashboard. They appear only in the 10-second montage, framed as "AI-built tools", not "AI-powered".

**Client data:** montage shots of the Channellock and IIP dashboards should blur the numbers unless the client approves. Ifitspaper and AI Training footage uses fictional demo data and is safe.

**Narrator voice:** not a podcast/news episode, so pick the best-fit Gemini voice (confident, warm, product-launch tone) per `CLAUDE.md`, and state which and why.

**Style fit:** the `claude-feature-video` skill (calm, real UI in a floating window, camera punch-ins) suits the three hero beats; `product-demo-video` (kinetic type) suits the open, the 40h → minutes stat and the montage. Pick one and keep the grammar consistent.

## 6. Running the apps locally to record footage (no login screen)

All paths are under `/Users/trannn23/Documents/SF_Work/`. Treat SF Pricing, Store Walk and Channellock as **read-only**: they connect to production data, so don't save, delete, generate plans or regenerate pitches on camera unless that's intended.

| App | How to get past login | Command | URL |
|---|---|---|---|
| SF Pricing | `.env` sets `AUTH_BYPASS=0`; override it for the run only | `cd "SF pricing" && AUTH_BYPASS=1 npm run dev` | http://127.0.0.1:5173 (portal: `/estimates.html`) |
| Store Walk | `.env.local` already has `AUTH_BYPASS=true` (synthetic admin) | `cd "Store Walk App" && npx next dev -p 3100` | http://localhost:3100 (`/gallery`, `/timeline`, `/insights`, `/manual`) |
| Channellock dashboard | `.env.local` has `DASHBOARD_AUTH_REQUIRED=false` | API: `cd "Chan Sales Dashboard/backend" && set -a && . ../.env.local && set +a && uv run uvicorn app.main:app --port 8000`; UI: `cd "Chan Sales Dashboard" && npx vite --port 5180` | http://localhost:5180 |
| IIP POS | No auth locally; reads JSON in `dashboard/public/data` (ends Aug 2026) | `cd "IIP POS/dashboard" && npx vite --port 5181` | http://localhost:5181 |
| Ifitspaper | `VITE_DEV_AUTOLOGIN=true` logs in as the seeded owner; emulators + demo data, nothing touches production | `cd Ifitspaper && PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH npm run local` | http://localhost:5173 (owner view; Schedule, Dashboard, Team, Reports) |
| AI Training | Emulators start empty, so seed them with `scripts/ai-training-emulator-seed.mjs` (real 30-lesson catalog + 9 fictional demo staff) | 1) `cd "AI Training app" && PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH npx firebase emulators:start --only firestore,auth --project sf-internal-495418` 2) `node /Users/trannn23/Documents/Video-Analyzer/projects/2026-10-25_promo_ai-capabilities/scripts/ai-training-emulator-seed.mjs` 3) `VITE_USE_EMULATOR=1 npx vite --port 5190` | http://localhost:5190 |

Java: OpenJDK 21 is installed via Homebrew (keg-only), so prefix commands with the `PATH=` shown above.

AI Training sign-in: the emulator's Google popup works in a normal browser (pick "Demo Admin"). In a single-tab browser it can't finish; instead run this in the page console to sign in as the demo master manager:
```js
const { auth } = await import('/src/firebase/app.js');
const fa = await import(performance.getEntriesByType('resource').map(e => e.name).find(n => /firebase_auth\.js/.test(n)));
await fa.signInWithCredential(auth, fa.GoogleAuthProvider.credential(JSON.stringify({ sub: 'g-demo-admin', email: 'demo.admin@salesfactory.com', email_verified: true, name: 'Demo Admin' })));
```

SF Pricing and Store Walk need Google Application Default Credentials (`gcloud auth application-default login`), which are already set up on this Mac.

## 7. Existing footage and assets to reuse

- `SF_Work/SF pricing/recordings/videos/` : 7 scripted demo videos (re-recordable via `recordings/scripts/*.mjs`).
- `SF_Work/Store Walk App/public/guide-videos/` : 9 tutorial clips.
- `SF_Work/Store Walk Video/out/final.mp4` : finished 90 s Store Walk promo + `docs/shotlist.md`.
- `SF_Work/IIP POS/dashboard/public/brand/ooh-iip.mp4` and `SF_Work/Chan Sales Dashboard/public/brand/floating-tools-2.mp4` : dashboard hero videos.
- `SF_Work/Automated Workflow/*.html` : before/after flowcharts ready to screen-capture.
- `SF_Work/Salsify Channellock/compare.html` and `output/pdf/Chan-Salsify-September.pdf`.
- `SF_Work/Mando/output/pdf/` : the static "before" PDFs.
