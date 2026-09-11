import { el, mount } from '@/utils/dom';
import { createHeader } from '@/components/layout/header';
import { createButton } from '@/components/common/button';
import { getAllTrainingModules, getTrainingModuleById } from '@/data/training-repository';
import type { TrainingModule } from '@/types/training';
import {
  getTrainingProgress,
  isModuleCompleted,
  toggleModuleCompletion,
} from '@/core/training-progress';

interface TrainingPageOptions {
  readonly onNavigateHome: () => void;
  readonly onNavigateContext: () => void;
}

function renderModuleList(root: Element, options: TrainingPageOptions): void {
  const header = createHeader({
    onNavigateHome: options.onNavigateHome,
    onNavigateContext: options.onNavigateContext,
    onNavigateTraining: () => {
      /* déjà sur cet écran */
    },
  });

  const modules = getAllTrainingModules();
  const progress = getTrainingProgress();
  const completedCount = modules.filter((m) => isModuleCompleted(progress, m.id)).length;

  const list = el(
    'ol',
    { class: 'training-module-list' },
    modules.map((trainingModule) => {
      const done = isModuleCompleted(progress, trainingModule.id);
      const item = el(
        'li',
        {
          class: `training-module-list__item ${done ? 'is-done' : ''}`,
          tabindex: '0',
          role: 'button',
        },
        [
          el('span', { class: 'training-module-list__index' }, [
            done ? '✓' : String(trainingModule.order),
          ]),
          el('div', { class: 'training-module-list__body' }, [
            el('span', { class: 'training-module-list__title' }, [trainingModule.title]),
            el('span', { class: 'training-module-list__summary' }, [trainingModule.summary]),
          ]),
          el('span', { class: 'training-module-list__duration' }, [
            `${trainingModule.estimatedMinutes} min`,
          ]),
        ],
      );
      const open = (): void => {
        window.location.hash = `#/training/${trainingModule.id}`;
      };
      item.addEventListener('click', open);
      item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      });
      return item;
    }),
  );

  const main = el('main', { class: 'page page--training' }, [
    el('h1', {}, ['Formation']),
    el('p', { class: 'page__intro' }, [
      'Cinq modules courts pour apprendre les bonnes pratiques de travail avec l’IA. ' +
        `${completedCount} / ${modules.length} terminés.`,
    ]),
    list,
  ]);

  mount(root, el('div', {}, [header, main]));
}

function renderModuleReader(root: Element, moduleId: string, options: TrainingPageOptions): void {
  const maybeModule = getTrainingModuleById(moduleId);

  if (!maybeModule) {
    mount(
      root,
      el('main', { class: 'page page--not-found' }, [
        el('h1', {}, ['Module introuvable']),
        createButton({
          label: 'Retour à la formation',
          onClick: () => (window.location.hash = '#/training'),
        }),
      ]),
    );
    return;
  }

  const trainingModule: TrainingModule = maybeModule;

  function render(): void {
    const header = createHeader({
      onNavigateHome: options.onNavigateHome,
      onNavigateContext: options.onNavigateContext,
      onNavigateTraining: () => (window.location.hash = '#/training'),
    });

    const progress = getTrainingProgress();
    const done = isModuleCompleted(progress, trainingModule.id);

    const sections = trainingModule.sections.map((section) =>
      el('section', { class: 'training-section' }, [
        el('h3', {}, [section.heading]),
        ...section.paragraphs.map((p) => el('p', {}, [p])),
        section.bullets
          ? el(
              'ul',
              { class: 'training-section__bullets' },
              section.bullets.map((b) => el('li', {}, [b])),
            )
          : '',
      ]),
    );

    const takeaways = el('section', { class: 'block block--takeaways' }, [
      el('h3', {}, ['À retenir']),
      el(
        'ul',
        { class: 'checklist' },
        trainingModule.keyTakeaways.map((t) => el('li', { class: 'checklist-item' }, [t])),
      ),
    ]);

    const completeCheckbox = el('input', { type: 'checkbox', id: 'module-complete' });
    completeCheckbox.checked = done;
    completeCheckbox.addEventListener('change', () => {
      toggleModuleCompletion(progress, trainingModule.id, completeCheckbox.checked);
      render();
    });
    const completeToggle = el('div', { class: 'checklist-item' }, [
      completeCheckbox,
      el('label', { for: 'module-complete' }, ['Marquer ce module comme terminé']),
    ]);

    const backButton = createButton({
      label: '← Retour à la formation',
      variant: 'ghost',
      onClick: () => (window.location.hash = '#/training'),
    });

    const main = el('main', { class: 'page page--training-reader' }, [
      backButton,
      el('h1', {}, [trainingModule.title]),
      el('p', { class: 'page__intro' }, [trainingModule.summary]),
      ...sections,
      takeaways,
      el('section', { class: 'block' }, [completeToggle]),
    ]);

    mount(root, el('div', {}, [header, main]));
  }

  render();
}

export function renderTrainingPage(root: Element, options: TrainingPageOptions): void {
  renderModuleList(root, options);
}

export function renderTrainingModulePage(
  root: Element,
  moduleId: string,
  options: TrainingPageOptions,
): void {
  renderModuleReader(root, moduleId, options);
}
