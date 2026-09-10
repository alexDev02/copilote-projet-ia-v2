import { el } from '@/utils/dom';

let container: HTMLElement | null = null;

function getContainer(): HTMLElement {
  if (container) return container;
  const node = el('div', { class: 'toast-container', role: 'status', 'aria-live': 'polite' });
  document.body.appendChild(node);
  container = node;
  return node;
}

export function showToast(message: string, kind: 'success' | 'error' = 'success'): void {
  const toast = el('div', { class: `toast toast--${kind}` }, [message]);
  getContainer().appendChild(toast);
  window.setTimeout(() => toast.remove(), 3000);
}
