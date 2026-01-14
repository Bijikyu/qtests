# Publishing to GitHub Packages

`qtests` is now published as `@bijikyu/qtests` through GitHub Packages. The scoped name plus the `publishConfig.registry` entry in `package.json` make sure `npm publish` targets `https://npm.pkg.github.com/` automatically. Follow the steps below to consume or release the package.

## Client setup

1. Add the `@bijikyu` scope to your `.npmrc` so npm knows where to find the package:

   ```ini
   @bijikyu:registry=https://npm.pkg.github.com
   always-auth=true
   //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
   ```

   - You can replace `${NODE_AUTH_TOKEN}` with a personal access token (PAT) that has the `pkg` scope, or run `npm login --scope=@bijikyu --registry=https://npm.pkg.github.com` to generate the file automatically.
   - The workflow below uses `${GITHUB_NODE_TOKEN}` (wired to `${{ secrets.GITHUB_TOKEN }}`) so no extra secret is required in CI.

2. Install the package with the scoped name:

   ```bash
   npm install @bijikyu/qtests --save-dev
   ```

   The runner and generator scripts stay the same (`npx qtests-generate`, `node qtests-runner.mjs`), but the package name ensures GitHub Packages is the source.

## Release workflow

Publishing is handled by `.github/workflows/publish.yml`. A release is triggered every time a GitHub release of type `published` is created (or when you manually invoke the workflow):

- **Checkout & Node setup** – checks out the repository and guarantees Node 20 with npm caching.
- **Install dependencies** – runs `npm ci`.
- **Run unit tests** – executes `npm test` to keep releases gated on the qtests runner.
- **Build assets** – executes `npm run build` before publishing.
- **Publish** – runs `npm publish`, letting the `publishConfig` entry push the package to `https://npm.pkg.github.com/`.

The workflow sets `GITHUB_NODE_TOKEN=${{ secrets.GITHUB_TOKEN }}` so the `.npmrc` entry above works without additional secrets. It also requests `packages: write` permission so the GitHub Packages write scope is enabled for the token.

## Manual release (optional)

If you need to publish locally instead of through the workflow:

1. Bump the version with `npm version patch|minor|major` and push the tag (`git push --follow-tags`).
2. Create a GitHub release (the workflow will run automatically once the release is published).
3. Alternatively, run `npm publish --registry=https://npm.pkg.github.com` after setting the scoped `.npmrc` listed above; the `prepublishOnly` hook already runs `npm run build` to keep the dist folder fresh.

## Post-publish checks

- Verify the new version on GitHub Packages (`https://npm.pkg.github.com/package/@bijikyu%2Fqtests`).
- Use `npm view @bijikyu/qtests dist-tags` or `npm info @bijikyu/qtests` to inspect the published metadata.

For more context about installation and CI wiring, see [README](../README.md) and [`docs/ENTERPRISE_INTEGRATION.md`](ENTERPRISE_INTEGRATION.md).
