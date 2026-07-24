# Q Brief: Team and VERUN Introduction Chapters

Status: Ready for implementation  
Repository: `verun-ai-meetup`  
Prepared: 2026-07-24  
Human reviewer: Nils Engeln

## Objective

Add two full-screen chapters to the existing VERUN AI Meetup Explorer:

1. **Team** — who the human founders are and how they relate to the agent team.
2. **VERUN** — what the company is building and why it needs to exist.

These chapters should give an audience enough context to understand the people and product before the existing operating-model story begins. This remains an AI-meetup presentation, not an investor pitch deck.

## Story Order

Insert both chapters after the current opening chapter and before `Specialists`:

1. Company OS
2. Team
3. VERUN
4. Specialists
5. One request
6. Work ledger
7. Shared brain
8. Human in the loop

Update chapter numbering, navigation, progress controls, keyboard navigation, the opening CTA, prompt routing, and every hard-coded scene index.

Recommended opening CTA after the change: `Meet the team`.

The overview prompt should route:

- `team`, `founder`, `Rafael`, or `Nils` to Team.
- `VERUN`, `product`, `gateway`, `finance`, or `building` to VERUN.
- `agent` or `specialist` to Specialists.
- `request`, `work`, or `run` to One request.
- `brain`, `wiki`, or `memory` to Shared brain.

## Chapter 02: Team

### Purpose

Introduce the accountable humans before presenting their specialist agents. The chapter should make the operating model legible: agents expand the team's capacity, while people retain strategy, judgment, and responsibility.

### Recommended Copy

**Kicker**

> Who we are

**Headline**

> Two founders. One AI-native operating model.

**Introduction**

> Rafael and Nils combine finance, venture, product, and operations experience. Around them, specialist agents research, draft, implement, and document work, while humans own strategy, external claims, and every irreversible decision.

**Rafael Schultz**

- Role: `Co-Founder`
- Focus: `Payments, digital assets, venture capital, fundraising, and institutional partnerships.`

**Nils Engeln**

- Role: `Co-Founder · Product & Operations`
- Focus: `Product direction, agent infrastructure, operations, and agentic-finance architecture.`

**Closing principle**

> The agents expand capacity. The founders remain accountable.

### Composition

- Keep the humans as the first and strongest visual signal.
- Use two balanced founder profiles with initials `RS` and `NE`.
- Do not require portraits: no approved headshot assets exist in this repository.
- Add a restrained relationship line beneath the profiles:
  `2 founders → 5 named specialists → one shared brain and work ledger`.
- Reuse the existing visual language, spacing, icons, and brand tokens.
- Do not turn the chapter into an org chart or a nested card layout.

### Team Claim Guardrails

- Use `Rafael`, not `Raphael`.
- Present the current VERUN founding team as Rafael and Nils.
- Do not add Fahad Farooq to this chapter without new human approval.
- Do not display the pitch-deck claims `>€110M fundraising volume` or `>€20M AUM` in this implementation. They exist in a draft external-feedback note but have not been reconfirmed for this meetup page.
- Do not imply that an agent is a legal founder, executive, employee, or accountable decision-maker.

## Chapter 03: VERUN

### Purpose

Explain the company independently of its internal agent architecture. The audience should leave this chapter knowing what VERUN is, which problem it addresses, what the current MVP demonstrates, and where the product boundary sits.

### Recommended Copy

**Kicker**

> What we are building

**Headline**

> One permissioned gateway between AI agents and financial institutions.

**Product statement**

> VERUN is an Agent Service Provider for regulated finance. Its MCP/API gateway gives investor-side AI agents one read-only interface to discover and compare opportunities across banks, brokers, fund platforms, and tokenization platforms, check explicit mandate constraints, and prepare a provider-controlled handoff.

**Why we are building it**

> AI agents are becoming a new interface, but financial products and workflows remain fragmented across provider portals, APIs, and compliance processes. Raw API access is not enough: requests need context, permission, qualification, routing, and an auditable handoff.

**Outcome**

> VERUN makes financial platforms agent-ready without requiring every agent to integrate with every institution separately.

**Current boundary**

> Today: a read-only MVP using synthetic opportunities. No investment advice, KYC data, orders, payments, or autonomous execution. Final eligibility and execution remain with the provider and the human.

### Suggested Visual

Build a clear horizontal system diagram:

`Investor-side AI agent → VERUN MCP/API gateway → Banks · Brokers · Fund platforms · Tokenization platforms`

Inside or beneath the VERUN gateway, show four compact capabilities:

1. Discover and normalize
2. Match explicit mandates
3. Qualify and route
4. Prepare an auditable handoff

Add a boundary band:

`Read-only · synthetic data · human/provider controlled`

Use Lucide icons and CSS shapes already consistent with the site. Do not introduce partner logos, fabricated interfaces, stock imagery, or a generic network illustration.

### Product Claim Guardrails

- Lead with `Agent Service Provider`, `MCP/API gateway`, and `read-only discovery and handoff`.
- Do not lead with the older `trust layer` story.
- Do not describe VERUN as executing investments, moving money, making autonomous investment decisions, owning KYC/KYB, or providing investment advice.
- Do not imply live production bank integrations. The current deployed MVP uses normalized synthetic opportunities and provider-adapter shapes.
- Do not claim regulatory approval or certification.
- Supporting concepts such as trust scores, x402 payments, attestations, and on-chain anchoring are not the current headline product and should not appear on this introductory chapter.
- Use `VERUN` throughout. Use `ERSTER` only when historically necessary; it is not needed on these chapters.

## Source Record

Use these sources in order of authority:

1. `../verun-wiki/pages/infrastructure/VERUN ASP Gateway MVP.md`
   - Status `implemented`, confidence `high`, updated 2026-07-10.
   - Defines the current read-only MCP service, four-tool surface, synthetic-data boundary, and prohibited actions.
2. `../verun-wiki/pages/notes/Verun-Baha-meeting-notes.md`
   - Records the 2026-07-01 pivot from trade execution/trust-layer framing to a read-only AI gateway and transaction connector.
3. `../verun-wiki/pages/concepts/VERUN Product Scope.md`
   - Defines the ASP gateway category, fragmented-provider problem, target platform types, and discovery/routing positioning.
4. `../verun-wiki/pages/notes/final-pitch-deck-version-sent-out-for-initial-external-feedback.md`
   - Supports the Rafael/Nils founder roles and background categories. It is a draft note, so quantitative claims are excluded.
5. `../verun-wiki/pages/entities/Nils Engeln.md`
   - Supports Nils's product, operations, agent-infrastructure, and agentic-finance responsibilities.

If a conflict exists, prefer the July 10 implemented MVP record over older concept or pitch material.

## Implementation Notes

Likely files:

- `src/App.tsx`
- `src/styles.css`
- `README.md`

Required code changes:

- Extend `SceneId` with `team` and `verun`.
- Insert both scene records and renumber all eight chapters.
- Add `TeamScene` and `VerunScene`.
- Update the render switch.
- Replace hard-coded navigation indices with corrected values or an ID-based helper.
- Update opening prompt routing and CTA.
- Update README chapter and architecture description.

Keep the existing single-screen explorer structure. Do not add routes, a new landing page, a carousel dependency, a diagram library, or new runtime dependencies.

## Acceptance Criteria

### Content

- Team chapter names only Rafael Schultz and Nils Engeln as human founders.
- Team roles and descriptions match this brief.
- VERUN chapter clearly answers both `what` and `why`.
- Current product boundary is visible without opening another panel.
- No older trust-layer or autonomous-execution claim is presented as current.
- No unsupported metrics, partner logos, bank integrations, or regulatory claims appear.

### Interaction

- Eight chapters appear in the intended order.
- All chapter labels and numeric markers are correct.
- Previous/next controls, progress dots, chapter navigation, keyboard arrows, and Home work.
- Opening prompt routes to the correct new and existing chapters.
- No navigation uses a stale hard-coded index.

### Visual QA

- Preserve the canonical VERUN brand system in `brand.md`.
- Team and VERUN are first-viewport signals on their chapters.
- No nested cards, decorative gradient orbs, or generic AI imagery.
- Copy is readable without overlap at desktop and mobile sizes.
- Check at minimum around `1440×900`, `1024×768`, and `390×844`.
- Verify no horizontal overflow, clipped chapter navigation, or console errors.

### Checks and Handoff

Run:

```bash
npm run typecheck
npm run build
```

Perform desktop and mobile browser QA. Create a local commit in the isolated Q worktree and stop for human review. Do not merge or deploy.

In the completion note, report:

- changed files
- commit hash
- checks run
- screenshots or viewport results
- any remaining factual or visual questions
