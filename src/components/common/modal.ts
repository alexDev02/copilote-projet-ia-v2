import { el } from '@/utils/dom';

interface ModalOptions {
  readonly title: string;
  readonly content: readonly (Node | string)[];
}

export function openModal(options: ModalOptions): { close: () => void } {
  const previouslyFocused = document.activeElement as HTMLElement | null;

  const closeButton = el(
    'button',
    { class: 'modal__close', type: 'button', 'aria-label': 'Fermer' },
    ['✕'],
  );

  const dialog = el(
    'div',
    { class: 'modal__dialog', role: 'dialog', 'aria-modal': 'true', 'aria-label': options.title },
    [
      el('div', { class: 'modal__header' }, [el('h2', {}, [options.title]), closeButton]),
      el('div', { class: 'modal__body' }, options.content),
    ],
  );

  const overlay = el('div', { class: 'modal__overlay' }, [dialog]);

  const close = (): void => {
    overlay.remove();
    document.removeEventListener('keydown', onKeyDown);
    previouslyFocused?.focus();
  };

  function onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') close();
  }

  closeButton.addEventListener('click', close);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });
  document.addEventListener('keydown', onKeyDown);

  document.body.appendChild(overlay);
  closeButton.focus();

  return { close };
}
