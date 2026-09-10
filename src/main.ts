import '@/style/main.css';
import { createRouter } from '@/core/router';
import { renderHomePage } from '@/pages/home';
import { renderContextPage } from '@/pages/context';
import { renderWorkflowPage } from '@/pages/workflow';
import { renderTrainingPage } from '@/pages/training';
import { el, mount } from '@/utils/dom';

const root = document.getElementById('app');
if (!root) throw new Error('Élément racine #app introuvable.');

function goHome(): void {
  window.location.hash = '#/';
}
function goContext(): void {
  window.location.hash = '#/context';
}
function goTraining(): void {
  window.location.hash = '#/training';
}
function goWorkflow(workflowId: string): void {
  window.location.hash = `#/workflow/${workflowId}`;
}

createRouter((route) => {
  switch (route.name) {
    case 'home':
      renderHomePage(root, {
        onNavigateContext: goContext,
        onNavigateTraining: goTraining,
        onOpenWorkflow: goWorkflow,
      });
      break;
    case 'context':
      renderContextPage(root, { onNavigateHome: goHome, onNavigateTraining: goTraining });
      break;
    case 'training':
      renderTrainingPage(root, { onNavigateHome: goHome, onNavigateContext: goContext });
      break;
    case 'workflow':
      renderWorkflowPage(root, {
        workflowId: route.workflowId,
        onNavigateHome: goHome,
        onNavigateContext: goContext,
        onNavigateTraining: goTraining,
      });
      break;
    case 'not-found':
      mount(
        root,
        el('main', { class: 'page page--not-found' }, [el('h1', {}, ['Page introuvable'])]),
      );
      break;
  }
});
