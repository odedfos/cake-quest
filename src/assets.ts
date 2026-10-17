// Every illustration under assets/ that exists at build time, keyed by its path
// relative to assets/ (e.g. "backgrounds/bg_title.png"). Missing files simply
// aren't in the map, and GameImage shows a labelled placeholder for them.
const found = import.meta.glob<string>('/assets/**/*.{png,webp,jpg,jpeg,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
});

export function indexAssets(files: Record<string, string>): Map<string, string> {
  const index = new Map<string, string>();
  for (const [file, url] of Object.entries(files)) {
    index.set(file.replace(/^\/assets\//, ''), url);
  }
  return index;
}

const assets = indexAssets(found);

export function assetUrl(path: string): string | undefined {
  return assets.get(path);
}
