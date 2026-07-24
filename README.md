# VERUN AI Meetup Explorer

An interactive visual story for AI meetups showing how VERUN is building an agentic company.

The experience reflects the current team, product, and operating architecture:

- Rafael Schultz and Nils Engeln are VERUN's human founders. They retain strategy, judgment, external claims, and every irreversible decision.
- VERUN is an Agent Service Provider for regulated finance. Its current MCP/API gateway MVP provides read-only discovery, explicit mandate matching, qualification, routing, and provider-controlled handoff over synthetic opportunities.
- The MVP does not provide investment advice, hold KYC data, place orders, move money, or execute autonomously.
- Moneypenny, Vesper, and Q are the Hermes agent group for knowledge, narrative support, and guarded implementation.
- Atlas and Kite are the OpenClaw agent group for technical validation and research-to-artifact work.
- Vesper supports source-backed narratives but does not publish externally.
- Hermes Kanban is the durable work ledger.
- The VERUN Markdown wiki is the canonical runtime memory and mirrors through GitHub into the team's Obsidian vaults.
- Atlas and Kite are live in Rafael's OpenClaw/Telegram environment while the final private VERUN bridge connection remains in progress.

The eight chapters are: Company OS, Team, VERUN, Specialists, One request, Work ledger, Shared brain, and Human in the loop. The Team chapter introduces the accountable founders before the specialist agents; the VERUN chapter explains the product, fragmented-provider problem, gateway capabilities, and current read-only boundary.

The “One request” chapter follows the meetup-site path from human brief through Moneypenny, Kanban, Vesper, Q implementation and checks, human review, Vercel deployment, and wiki write-back. The Work ledger chapter is a dated snapshot of real card `t_accf763c`, not a simulated live board.

External publishing, merges, production deployment, and promotion into canonical company knowledge remain human-controlled.

## Local Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run typecheck
npm run build
```

The production build is emitted to `dist/`.
