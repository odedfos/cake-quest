import type { ComponentChildren } from 'preact';
import { useEffect } from 'preact/hooks';

type Props = {
  title: string;
  onClose: () => void;
  children: ComponentChildren;
  class?: string;
};

// A modal sheet for the notebook, settings and Dad's note.
export function Panel({ title, onClose, children, class: className = '' }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div class="panel-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <section class={`panel ${className}`} role="dialog" aria-modal="true" aria-label={title}>
        <header class="panel__head">
          <h2 class="panel__title">{title}</h2>
          <button type="button" class="btn btn--close" aria-label="Close" onClick={onClose}>
            ✕
          </button>
        </header>
        <div class="panel__body">{children}</div>
      </section>
    </div>
  );
}
