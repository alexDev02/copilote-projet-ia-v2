import { el, mount } from '@/utils/dom';
import { createHeader } from '@/components/layout/header';
import { createButton } from '@/components/common/button';
import { createTextField } from '@/components/common/form-field';
import { showToast } from '@/components/common/toast';
import { getWorkflowById } from '@/data/workflow-repository';
import { storageService } from '@/core/storage-service';
import { buildFinalPrompt } from '@/core/prompt-builder';
import { copyToClipboard } from '@/utils/clipboard';
import {
  loadOrCreateInstance,
  getCurrentStep,
  getStepProgress,
  isStepValidationSatisfied,
  updateStepFormData,
  toggleChecklistItem,
  goToNextStep,
  goToPreviousStep,
} from '@/core/workflow-engine';
import type { Workflow, WorkflowStep } from '@/types/workflow';
import type { WorkflowInstance } from '@/types/progress';
import systemRules from '@/data/system-rules.json';
import type { SystemRules } from '@/types/system-rules';

interface WorkflowPageOptions {
  readonly workflowId: string;
  readonly onNavigateHome: () => void;
  readonly onNavigateContext: () => void;
  readonly onNavigateTraining: () => void;
}

function renderStepper(totalSteps: number, currentOrder: number): HTMLElement {
  return el('div', { class: 'stepper' }, [
    el('span', { class: 'stepper__label' }, [`Étape ${currentOrder} / ${totalSteps}`]),
    el('div', { class: 'stepper__track' }, [
      el('div', {
        class: 'stepper__fill',
        style: `width: ${Math.round((currentOrder / totalSteps) * 100)}%`,
      }),
    ]),
  ]);
}

function renderDocumentsBlock(step: WorkflowStep): HTMLElement | null {
  if (step.documents.length === 0) return null;
  return el('section', { class: 'block block--documents' }, [
    el('h3', {}, ["Ce dont l'IA a besoin"]),
    el(
      'ul',
      { class: 'document-list' },
      step.documents.map((doc) =>
        el('li', {}, [
          el('span', { class: 'document-list__label' }, [doc.label]),
          doc.purpose ? el('span', { class: 'document-list__purpose' }, [doc.purpose]) : '',
        ]),
      ),
    ),
    el('p', { class: 'block__note' }, [
      'Ajoutez ces documents directement dans votre conversation avec votre IA.',
    ]),
  ]);
}

export function renderWorkflowPage(root: Element, options: WorkflowPageOptions): void {
  const maybeWorkflow = getWorkflowById(options.workflowId);

  if (!maybeWorkflow) {
    mount(
      root,
      el('main', { id: 'main-content', class: 'page page--not-found' }, [
        el('h1', {}, ['Workflow introuvable']),
        el('p', {}, ['Ce workflow n’existe pas ou n’est pas encore disponible.']),
      ]),
    );
    return;
  }

  const workflow: Workflow = maybeWorkflow;
  let instance: WorkflowInstance = loadOrCreateInstance(workflow);

  function render(): void {
    const header = createHeader({
      onNavigateHome: options.onNavigateHome,
      onNavigateContext: options.onNavigateContext,
      onNavigateTraining: options.onNavigateTraining,
    });

    if (instance.status === 'COMPLETED') {
      mount(root, el('div', {}, [header, renderCompletionScreen()]));
      return;
    }

    const step = getCurrentStep(workflow, instance);
    const progress = getStepProgress(instance, step.id);
    const projectContext = storageService.getProjectContext();

    const inputsBlock =
      step.inputs.length > 0
        ? el(
            'section',
            { class: 'block block--inputs' },
            step.inputs.map((inputField) => {
              const { field, input } = createTextField({
                id: inputField.id,
                label: inputField.label,
                value: progress.formData[inputField.id] ?? '',
                required: inputField.required,
                multiline: inputField.type === 'textarea',
                ...(inputField.placeholder ? { placeholder: inputField.placeholder } : {}),
              });
              input.addEventListener('change', () => {
                instance = updateStepFormData(instance, step.id, inputField.id, input.value);
              });
              return field;
            }),
          )
        : null;

    const documentsBlock = renderDocumentsBlock(step);

    let promptBlock: HTMLElement | null = null;
    if (step.prompt) {
      const promptText = buildFinalPrompt(
        systemRules as SystemRules,
        projectContext,
        workflow,
        step,
        progress.formData,
      );
      const copyButton = createButton({
        label: 'Copier l’instruction',
        onClick: () => {
          void copyToClipboard(promptText)
            .then(() => showToast('Instruction copiée.'))
            .catch(() => showToast('Échec de la copie.', 'error'));
        },
      });
      promptBlock = el('section', { class: 'block block--prompt' }, [
        el('h3', {}, ['Instruction IA']),
        el('pre', { class: 'prompt-box' }, [promptText]),
        copyButton,
      ]);
    }

    let checklistBlock: HTMLElement | null = null;
    if (step.validation && step.validation.checklist.length > 0) {
      const items = step.validation.checklist.map((item) => {
        const checkbox = el('input', {
          type: 'checkbox',
          id: `chk-${item.id}`,
        });
        checkbox.checked = progress.checklistState[item.id] === true;
        checkbox.addEventListener('change', () => {
          instance = toggleChecklistItem(instance, step.id, item.id, checkbox.checked);
          renderNavigation();
        });
        return el('li', { class: 'checklist-item' }, [
          checkbox,
          el('label', { for: `chk-${item.id}` }, [item.label + (item.required ? ' *' : '')]),
        ]);
      });

      checklistBlock = el('section', { class: 'block block--checklist' }, [
        step.validation.instruction
          ? el('p', { class: 'block__note' }, [step.validation.instruction])
          : '',
        el('ul', { class: 'checklist' }, items),
      ]);
    }

    const navContainer = el('div', { class: 'workflow-nav' });

    function renderNavigation(): void {
      navContainer.replaceChildren();
      const canGoNext = isStepValidationSatisfied(step, getStepProgress(instance, step.id));

      const previousButton = createButton({
        label: '← Étape précédente',
        variant: 'ghost',
        disabled: workflow.steps[0]?.id === step.id,
        onClick: () => {
          instance = goToPreviousStep(workflow, instance);
          render();
        },
      });

      const isLastStep = workflow.steps[workflow.steps.length - 1]?.id === step.id;
      const nextButton = createButton({
        label: isLastStep ? 'Terminer le workflow' : 'Étape suivante →',
        disabled: !canGoNext,
        onClick: () => {
          instance = goToNextStep(workflow, instance);
          render();
        },
      });

      const quitButton = createButton({
        label: 'Quitter',
        variant: 'ghost',
        onClick: options.onNavigateHome,
      });

      navContainer.appendChild(
        el('div', { class: 'workflow-nav__row' }, [previousButton, quitButton, nextButton]),
      );
    }
    renderNavigation();

    const blocks = [
      el('section', { class: 'block block--why' }, [
        el('h3', {}, ['Ce que vous allez faire']),
        el('p', {}, [step.objective]),
        step.why ? el('p', { class: 'block__why' }, [`Pourquoi cette étape ? ${step.why}`]) : '',
      ]),
      inputsBlock,
      documentsBlock,
      promptBlock,
      checklistBlock,
    ].filter((node): node is HTMLElement => node !== null);

    const main = el('main', { id: 'main-content', class: 'page page--workflow' }, [
      el('h1', {}, [workflow.metadata.title]),
      renderStepper(workflow.steps.length, step.order),
      el('h2', { class: 'workflow-step-title' }, [step.title]),
      ...blocks,
      navContainer,
    ]);

    mount(root, el('div', {}, [header, main]));
  }

  function renderCompletionScreen(): HTMLElement {
    const restartButton = createButton({
      label: 'Recommencer',
      variant: 'secondary',
      onClick: () => {
        instance = loadOrCreateInstance(workflow);
        storageService.clearWorkflowInstance(workflow.id);
        render();
      },
    });
    const backButton = createButton({
      label: 'Retour aux workflows',
      onClick: options.onNavigateHome,
    });

    return el('main', { id: 'main-content', class: 'page page--completion' }, [
      el('h1', {}, ['Workflow terminé 🎉']),
      el('p', {}, [workflow.completion.message]),
      el(
        'ul',
        { class: 'checklist checklist--recap' },
        workflow.finalChecklist.map((item) => el('li', {}, [item.label])),
      ),
      el('div', { class: 'workflow-nav__row' }, [restartButton, backButton]),
    ]);
  }

  render();
}
