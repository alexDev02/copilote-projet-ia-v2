import type { WorkflowSummary } from '@/types/workflow';
import { el } from '@/utils/dom';

const CATEGORY_LABELS: Readonly<Record<string, string>> = {
  initialisation: 'Initialisation',
  cadrage: 'Cadrage',
  analyse: 'Analyse',
  planification: 'Planification',
  risques: 'Risques & problèmes',
  gouvernance: 'Gouvernance',
  qualite: 'Qualité & tests',
  deploiement: 'Déploiement',
  change: 'Change',
  cloture: 'Clôture',
  agile: 'Agile',
};

interface WorkflowCardOptions {
  readonly summary: WorkflowSummary;
  readonly onOpen: (workflowId: string) => void;
}

export function createWorkflowCard(options: WorkflowCardOptions): HTMLElement {
  const { summary, onOpen } = options;
  const { metadata } = summary;

  const card = el('article', { class: 'workflow-card', tabindex: '0', role: 'button' }, [
    el('div', { class: 'workflow-card__meta' }, [
      el('span', { class: 'workflow-card__category' }, [
        CATEGORY_LABELS[metadata.category] ?? metadata.category,
      ]),
      el('span', { class: 'workflow-card__duration' }, [`${metadata.estimatedMinutes} min`]),
    ]),
    el('h3', { class: 'workflow-card__title' }, [metadata.title]),
    el('p', { class: 'workflow-card__description' }, [metadata.description]),
    el('span', { class: 'workflow-card__cta' }, ['Lancer le workflow →']),
  ]);

  const open = (): void => onOpen(summary.id);
  card.addEventListener('click', open);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  });

  return card;
}
