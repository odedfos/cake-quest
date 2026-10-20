import { useState } from 'preact/hooks';
import { assetUrl } from '../assets';

type Props = {
  // Path under assets/, as named in docs/ASSETS.md.
  path: string;
  // Shown on the placeholder until the illustration exists.
  label: string;
  class?: string;
  alt?: string;
};

export function GameImage({ path, label, class: className = '', alt = '' }: Props) {
  const url = assetUrl(path);
  const [failed, setFailed] = useState(false);

  if (!url || failed) {
    return (
      <div class={`placeholder ${className}`} role="img" aria-label={alt || label} data-asset={path}>
        <span class="placeholder__label">{label}</span>
        <code class="placeholder__path">{path}</code>
      </div>
    );
  }

  return <img class={className} src={url} alt={alt} draggable={false} onError={() => setFailed(true)} />;
}
