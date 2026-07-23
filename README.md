# VERUN AI Meetup Explorer

An interactive visual story for AI meetups showing how VERUN is building an agentic company.

The experience reflects the current architecture:

- Moneypenny, Vesper, and Q are the Hermes agent group for knowledge, narrative support, and guarded implementation.
- Atlas and Kite are the OpenClaw agent group for technical validation and research-to-artifact work.
- Vesper supports source-backed narratives but does not publish externally.
- Hermes Kanban is the durable work ledger.
- The VERUN Markdown wiki is the canonical runtime memory and mirrors through GitHub into the team's Obsidian vaults.
- Atlas and Kite are live in Rafael's OpenClaw/Telegram environment while the final private VERUN bridge connection remains in progress.

The “One request” chapter follows the meetup-site path from human brief through Moneypenny, Kanban, Vesper, Q implementation and checks, human review, Vercel deployment, and wiki write-back. The Kanban chapter is a dated snapshot of real card `t_accf763c`, not a simulated live board.

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
