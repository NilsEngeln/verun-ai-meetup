# Who Manages Our Agents?

An interactive Claude Community Berlin show and tell about building a
Claude-powered Head of Agents for a multi-agent team.

The talk is organized for a 20-minute slot:

- `0:00-1:00` Introduction — Rafael
- `1:00-3:00` Context — Rafael
- `3:00-5:00` Claude as Head of Agents — Nils
- `5:00-6:00` Shared Markdown brain and retrieval — Nils
- `6:00-7:30` Manager prompt — Nils
- `7:30-9:00` Task orchestration prompt — Nils
- `9:00-10:00` Blocked-task prompt — Nils
- `10:00-12:00` Rough parts — Nils
- `12:00-17:00` Live example — Nils
- `17:00-18:00` Takeaways — Rafael
- `18:00-20:00` Q&A — Nils and Rafael

The presentation focuses on Claude's model, prompt, context retrieval,
tools, routing, permissions, and evidence requirements. It retains the
multi-agent operating setup as context while removing the VERUN product
pitch, company logos, fundraising material, and promotional claims.

The live example must use a sanitized real task. If the live workflow is
not ready, use a clearly dated recording rather than presenting the visual
walkthrough as a live system.

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
