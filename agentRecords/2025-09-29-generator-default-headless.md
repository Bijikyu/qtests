## Generator: Default Non‑Interactive Setup

- Area: `bin/qtests-generate.mjs`, `docs/test-generator.md`
- Goal: Make `qtests-generate` fully plug‑and‑play without extra flags.

### Changes
- Default behavior now auto‑wires the project (Jest config, runner, scripts) and ensures devDependencies.
- Auto‑install of missing devDependencies is attempted by default unless `CI` is detected; otherwise the exact `npm install -D ...` command is printed.
- Help text avoids introducing new flags for this flow; the CLI remains non‑interactive by design.

### Rationale
- Aligns with Background & Passive Solutions policy: no extra flags or environment variables required for standard tasks.
- CI safety: do not block CI by default; remain quiet and print actionable instructions when installation is disallowed.

