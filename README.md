# VERUN AI Meetup Explorer

An interactive visual story for AI meetups showing how VERUN is building an agentic company.

The experience reflects the current architecture:

- Moneypenny manages knowledge and operations from Slack.
- Vesper handles marketing intelligence and source-backed drafting.
- Q performs guarded coding work through Hermes Kanban, allowlisted repositories, and isolated worktrees.
- Hermes Kanban is the durable work ledger.
- The VERUN Markdown wiki mirrors through GitHub into the team's Obsidian vaults.
- Atlas and Kite are live in Rafael's OpenClaw/Telegram environment while the final private VERUN bridge connection remains in progress.

All external claims, publishing, merges, and deployments remain human-approved.

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
