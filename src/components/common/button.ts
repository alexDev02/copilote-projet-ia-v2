import { el } from '@/utils/dom';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonOptions {
  readonly label: string;
  readonly variant?: ButtonVariant;
  readonly onClick: () => void;
  readonly disabled?: boolean;
}

export function createButton(options: ButtonOptions): HTMLButtonElement {
  const variant = options.variant ?? 'primary';
  const button = el('button', { class: `btn btn--${variant}`, type: 'button' }, [options.label]);
  button.addEventListener('click', options.onClick);
  if (options.disabled === true) button.disabled = true;
  return button;
}
