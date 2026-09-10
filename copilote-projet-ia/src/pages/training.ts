import { el, mount } from '@/utils/dom';
import { createHeader } from '@/components/layout/header';

interface TrainingPageOptions {
  readonly onNavigateHome: () => void;
  readonly onNavigateContext: () => void;
}

const MODULE_TITLES: readonly string[] = [
  'Comprendre l’IA',
  'Donner du contexte',
  'Travailler avec l’IA',
  'Travailler avec ses documents',
  'Contrôler les résultats',
];

export function renderTrainingPage(root: Element, options: TrainingPageOptions): void {
  const header = createHeader({
    onNavigateHome: options.onNavigateHome,
    onNavigateContext: options.onNavigateContext,
    onNavigateTraining: () => {
      /* déjà sur cet écran */
    },
  });

  const main = el('main', { class: 'page page--training' }, [
    el('h1', {}, ['Formation']),
    el('p', { class: 'page__intro' }, [
      'Cinq modules courts pour apprendre les bonnes pratiques de travail avec l’IA. Contenu détaillé disponible prochainement.',
    ]),
    el(
      'ol',
      { class: 'training-module-list' },
      MODULE_TITLES.map((title, index) =>
        el('li', { class: 'training-module-list__item' }, [
          el('span', { class: 'training-module-list__index' }, [String(index + 1)]),
          el('span', {}, [title]),
        ]),
      ),
    ),
  ]);

  mount(root, el('div', {}, [header, main]));
}
