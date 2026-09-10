import { el } from '@/utils/dom';
import { storageService } from '@/core/storage-service';
import { APP_NAME } from '@/constants';

interface HeaderOptions {
  readonly onNavigateHome: () => void;
  readonly onNavigateContext: () => void;
  readonly onNavigateTraining: () => void;
}

export function createHeader(options: HeaderOptions): HTMLElement {
  const hasContext = storageService.getProjectContext() !== null;

  const logo = el('button', { class: 'header__logo', type: 'button', 'aria-label': 'Accueil' }, [
    el('span', { class: 'header__logo-mark', 'aria-hidden': 'true' }, ['→']),
    el('span', { class: 'header__logo-text' }, [APP_NAME]),
  ]);
  logo.addEventListener('click', options.onNavigateHome);

  const contextIndicator = el(
    'button',
    { class: `header__context-pill ${hasContext ? 'is-configured' : 'is-empty'}`, type: 'button' },
    [hasContext ? 'Contexte configuré' : 'Contexte non configuré'],
  );
  contextIndicator.addEventListener('click', options.onNavigateContext);

  const trainingLink = el('button', { class: 'header__link', type: 'button' }, ['Formation']);
  trainingLink.addEventListener('click', options.onNavigateTraining);

  const nav = el('nav', { class: 'header__nav' }, [contextIndicator, trainingLink]);

  return el('header', { class: 'header' }, [logo, nav]);
}
