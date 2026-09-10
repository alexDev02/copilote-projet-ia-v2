import type { Workflow, WorkflowStep, ChecklistItem } from '@/types/workflow';
import type { WorkflowInstance, StepProgress } from '@/types/progress';
import { storageService } from '@/core/storage-service';
import { WorkflowNotFoundError } from '@/utils/errors';

const EMPTY_STEP_PROGRESS: StepProgress = {
  formData: {},
  checklistState: {},
  isCompleted: false,
};

function nowIso(): string {
  return new Date().toISOString();
}

function createInstance(workflow: Workflow): WorkflowInstance {
  const firstStep = workflow.steps[0];
  if (!firstStep) throw new WorkflowNotFoundError(workflow.id);

  const timestamp = nowIso();
  return {
    instanceId: `inst_${workflow.id}_${Date.now()}`,
    workflowId: workflow.id,
    currentStepId: firstStep.id,
    status: 'IN_PROGRESS',
    createdAt: timestamp,
    updatedAt: timestamp,
    stepsData: {},
  };
}

/** Récupère l'instance existante ou en crée une nouvelle si l'utilisateur démarre le workflow. */
export function loadOrCreateInstance(workflow: Workflow): WorkflowInstance {
  return storageService.getWorkflowInstance(workflow.id) ?? createInstance(workflow);
}

export function getStepProgress(instance: WorkflowInstance, stepId: string): StepProgress {
  return instance.stepsData[stepId] ?? EMPTY_STEP_PROGRESS;
}

function findStepIndex(workflow: Workflow, stepId: string): number {
  return workflow.steps.findIndex((step) => step.id === stepId);
}

export function getCurrentStep(workflow: Workflow, instance: WorkflowInstance): WorkflowStep {
  const step = workflow.steps.find((s) => s.id === instance.currentStepId);
  if (!step) throw new WorkflowNotFoundError(`${workflow.id}/${instance.currentStepId}`);
  return step;
}

/** Vérifie que toutes les cases de checklist obligatoires sont cochées pour l'étape courante. */
export function isStepValidationSatisfied(step: WorkflowStep, progress: StepProgress): boolean {
  const requiredItems: readonly ChecklistItem[] = step.validation?.checklist ?? [];
  return requiredItems
    .filter((item) => item.required)
    .every((item) => progress.checklistState[item.id] === true);
}

function persist(instance: WorkflowInstance): WorkflowInstance {
  const updated: WorkflowInstance = { ...instance, updatedAt: nowIso() };
  storageService.saveWorkflowInstance(updated);
  return updated;
}

export function updateStepFormData(
  instance: WorkflowInstance,
  stepId: string,
  fieldId: string,
  value: string,
): WorkflowInstance {
  const current = getStepProgress(instance, stepId);
  const nextStepData: StepProgress = {
    ...current,
    formData: { ...current.formData, [fieldId]: value },
  };
  return persist({
    ...instance,
    stepsData: { ...instance.stepsData, [stepId]: nextStepData },
  });
}

export function toggleChecklistItem(
  instance: WorkflowInstance,
  stepId: string,
  itemId: string,
  checked: boolean,
): WorkflowInstance {
  const current = getStepProgress(instance, stepId);
  const nextStepData: StepProgress = {
    ...current,
    checklistState: { ...current.checklistState, [itemId]: checked },
  };
  return persist({
    ...instance,
    stepsData: { ...instance.stepsData, [stepId]: nextStepData },
  });
}

/** Avance à l'étape suivante si la validation de l'étape courante est satisfaite. */
export function goToNextStep(workflow: Workflow, instance: WorkflowInstance): WorkflowInstance {
  const currentIndex = findStepIndex(workflow, instance.currentStepId);
  const nextStep = workflow.steps[currentIndex + 1];

  const completedStepData: StepProgress = {
    ...getStepProgress(instance, instance.currentStepId),
    isCompleted: true,
  };
  const stepsData = { ...instance.stepsData, [instance.currentStepId]: completedStepData };

  if (!nextStep) {
    return persist({ ...instance, stepsData, status: 'COMPLETED' });
  }
  return persist({ ...instance, stepsData, currentStepId: nextStep.id });
}

export function goToPreviousStep(workflow: Workflow, instance: WorkflowInstance): WorkflowInstance {
  const currentIndex = findStepIndex(workflow, instance.currentStepId);
  const previousStep = workflow.steps[currentIndex - 1];
  if (!previousStep) return instance;
  return persist({ ...instance, currentStepId: previousStep.id });
}

export function restartWorkflow(workflow: Workflow): WorkflowInstance {
  storageService.clearWorkflowInstance(workflow.id);
  return persist(createInstance(workflow));
}
