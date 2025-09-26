# Record: qtests-ts-generate Flags & Runner Updates (2025-09-01)

- Implemented functional support for `--src`, `--include`, `--exclude` in `lib/testGenerator.ts` using glob-to-RegExp filtering on project-relative POSIX paths.
- Enabled `--mode ast` to augment export detection via TypeScript parser when available; falls back silently to heuristic mode otherwise.
- Made `--dry-run` fully dry: skips filesystem writes for Jest config, runner generation, and `package.json` updates.
- Ensured `qtests-runner.ts` is generated on non-dry runs even when no new test files are created, and `package.json` test script updated accordingly.
- Updated CLI help text in `bin/qtests-ts-generate` and docs to reference `qtests-ts-generate`.
- Documentation updates:
  - README CLI/programmatic usage updated for TypeScript ESM, new flags, and method names (`generateTestFiles`, `getResults`).
  - docs/test-generator.md converted to TS ESM, renamed CLI, added flag explanations, AST prerequisites, and dry-run semantics.
  - bin/summary.md and lib/summary.md adjusted to note side effects and new flag behaviors.

AI Anchors:
- 🚩AI: CLI_FLAGS_WIRING — options parsing aligned with core generator behavior.
- 🚩AI: TYPE_INFERENCE_OPTION — AST mode integrated and guarded.

