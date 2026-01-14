QTests MERN Demo

Purpose
- Integration testbed to validate qtests end-to-end: stub injection for axios/winston, Express routing, and the qtests runner lifecycle.

Structure
- `server/`: Express app with a sample route that calls an external service via axios (stubbed in tests).
- `client/`: Minimal React component as a placeholder for frontend (not built in CI to keep scope small).
- `config/`: Jest config and require polyfills aligned with qtests runner policies.
- `tests/`: Jest tests that verify routing and built-in stubs.

Commands
- `npm test` → Runs `qtests-generate` to scaffold `qtests-runner.mjs`, then executes it. Jest is invoked with `--config config/jest.config.mjs --passWithNoTests` by the runner.
- `npm run start:server` → Starts the Express app on `:3001`.
- `npm run start:client` → Starts Vite dev server for the React client on `:5173`.

Notes
- Tests call `require('@bijikyu/qtests/setup')` at the top to guarantee stubs activate before module imports.
- Jest `moduleNameMapper` maps `qtests/*` to the package’s built `dist/*` to avoid TS import issues when using a local `file:..` dependency.
- The axios stub returns a plain truthy object by design in many codebases; this demo asserts runner activation and route behavior rather than response shape.
- UI tests use jsdom via a per-file directive and Babel transform (`@babel/preset-env`, `@babel/preset-react`) to handle JSX.
