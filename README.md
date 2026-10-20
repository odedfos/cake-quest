# Cake Quest – מבצע עוגה

A web quest game for learning English: help a young meerkat prepare a surprise birthday for Mom.

**Play it:** https://odedfos.github.io/cake-quest/

- Spec: [docs/SPEC.md](docs/SPEC.md)
- Illustrations: [docs/ASSETS.md](docs/ASSETS.md)

## Run it

```sh
npm install
npm run dev      # local dev server
npm test         # unit tests
npm run build    # static site in dist/
```

Missing illustrations show as labelled placeholders. Drop a PNG into `assets/` with the name from `docs/ASSETS.md`, and it replaces its placeholder.

## CI and hosting

`.github/workflows/ci.yml` runs the type check, tests and build on every pull request and push. When they pass on `main`, it publishes `dist/` to GitHub Pages.
