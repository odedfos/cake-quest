import { render, type ComponentChildren } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach } from 'vitest';
import { App } from './app';
import { GameProvider } from './game/GameContext';
import { defaultSave, type SaveData } from './game/save';

let root: HTMLElement | undefined;

afterEach(() => {
  if (root) {
    render(null, root);
    root.remove();
    root = undefined;
  }
  localStorage.clear();
});

function attach(ui: ComponentChildren): HTMLElement {
  root = document.createElement('div');
  document.body.append(root);
  act(() => render(ui, root!));
  return root;
}

// Renders a component inside a game with the given save (a fresh one by default).
export function mount(ui: ComponentChildren, save: Partial<SaveData> = {}): HTMLElement {
  return attach(<GameProvider initial={{ ...defaultSave(), ...save }}>{ui}</GameProvider>);
}

// Renders the whole game, starting from the given save.
export function mountApp(save: Partial<SaveData> = {}): HTMLElement {
  return attach(<App initial={{ ...defaultSave(), ...save }} />);
}

export function type(input: HTMLInputElement, value: string) {
  act(() => {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

export function click(el: Element | null | undefined) {
  if (!el) throw new Error('Nothing to click');
  act(() => (el as HTMLElement).click());
}

export function button(root: HTMLElement, text: string | RegExp): HTMLButtonElement | undefined {
  return [...root.querySelectorAll('button')].find((b) =>
    typeof text === 'string' ? b.textContent?.trim() === text : text.test(b.textContent ?? ''),
  );
}
