import { el, mount } from '@/utils/dom';
import { createHeader } from '@/components/layout/header';
import { createWorkflowCard } from '@/components/common/workflow-card';
import { getAllWorkflowSummaries } from '@/data/workflow-repository';
import { APP_NAME, APP_TAGLINE } from '@/constants';

interface HomePageOptions {
  readonly onNavigateContext: () => void;
  readonly onNavigateTraining: () => void;
  readonly onOpenWorkflow: (workflowId: string) => void;
}

export function renderHomePage(root: Element, options: HomePageOptions): void {
  const header = createHeader({
    onNavigateHome: () => {
      /* déjà sur l'accueil */
    },
    onNavigateContext: options.onNavigateContext,
    onNavigateTraining: options.onNavigateTraining,
  });

  const searchInput = el('input', {
    class: 'search-input',
    type: 'search',
    placeholder: 'Rechercher une tâche...',
    'aria-label': 'Rechercher un workflow',
  });

  const hero = el('section', { class: 'hero' }, [
    el('h1', { class: 'hero__title' }, [APP_NAME]),
    el('p', { class: 'hero__tagline' }, [APP_TAGLINE]),
    el('p', { class: 'hero__promise' }, [
      'Vous savez que l’IA peut vous aider. Nous vous montrons exactement comment.',
    ]),
    el('div', { class: 'hero__search' }, [searchInput]),
  ]);

  const summaries = getAllWorkflowSummaries();
  const grid = el('div', { class: 'workflow-grid' });
  summaries.forEach((summary) => {
    grid.appendChild(createWorkflowCard({ summary, onOpen: options.onOpenWorkflow }));
  });

  const emptyState = el('p', { class: 'empty-state', hidden: 'true' }, [
    'Aucun workflow ne correspond à votre recherche.',
  ]);

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;
    Array.from(grid.children).forEach((child, index) => {
      const summary = summaries[index];
      if (!summary) return;
      const haystack = `${summary.metadata.title} ${summary.metadata.description} ${summary.metadata.tags.join(' ')}`.toLowerCase();
      const matches = haystack.includes(query);
      (child as HTMLElement).hidden = !matches;
      if (matches) visibleCount += 1;
    });
    emptyState.hidden = visibleCount > 0;
  });

  const catalogueSection = el('section', { class: 'catalogue' }, [
    el('h2', { class: 'catalogue__title' }, ['Que voulez-vous accomplir aujourd’hui ?']),
    grid,
    emptyState,
  ]);

  const main = el('main', { class: 'page page--home' }, [hero, catalogueSection]);
  mount(root, el('div', {}, [header, main]));
}
