# Publishing to npm

`qtests` is published as `@bijikyu/qtests` on the public npm registry. The scoped name and the `publishConfig` entry in `package.json` ensure `npm publish` targets `https://registry.npmjs.org/` automatically with public access.

## Installing the package

No registry configuration is needed. Install directly with npm, yarn, or pnpm:

```bash
npm install @bijikyu/qtests --save-dev
# or
yarn add -D @bijikyu/qtests
# or
pnpm add -D @bijikyu/qtests
```

The runner and generator scripts stay the same after installation:

```bash
npx qtests-generate      # scaffold tests for your project
node qtests-runner.mjs   # run the test suite
```

## Release workflow

Publishing is handled by `.github/workflows/publish.yml`. A release is triggered every time a GitHub release of type `published` is created (or when you manually invoke the workflow):

- **Checkout & Node setup** – checks out the repository and guarantees Node 20 with npm caching.
- **Install dependencies** – runs `npm ci`.
- **Run unit tests** – executes `npm test` to keep releases gated on the qtests runner.
- **Build assets** – executes `npm run build` before publishing.
- **Publish** – runs `npm publish`, letting the `publishConfig` entry push the package to the public npm registry with public access.

The workflow requires an `NPM_TOKEN` secret (an npm automation token with publish rights to the `@bijikyu` scope) to be set in the repository's GitHub Actions secrets.

## Manual release (optional)

If you need to publish locally instead of through the workflow:

1. Bump the version with `npm version patch|minor|major` and push the tag (`git push --follow-tags`).
2. Create a GitHub release (the workflow will run automatically once the release is published).
3. Alternatively, log in with `npm login` and run `npm publish` directly; the `prepublishOnly` hook already runs `npm run build` to keep the dist folder fresh.

## Post-publish checks

- Verify the new version at `https://www.npmjs.com/package/@bijikyu/qtests`.
- Use `npm view @bijikyu/qtests dist-tags` or `npm info @bijikyu/qtests` to inspect the published metadata.

For more context about installation and CI wiring, see [README](../README.md) and [`docs/ENTERPRISE_INTEGRATION.md`](ENTERPRISE_INTEGRATION.md).
