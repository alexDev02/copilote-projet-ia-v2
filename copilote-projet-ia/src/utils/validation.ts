import type { ProjectContext } from '@/types/context';
import type { WorkflowInstance, TrainingProgress } from '@/types/progress';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return isRecord(value) && Object.values(value).every((v) => typeof v === 'string');
}

function isBooleanRecord(value: unknown): value is Record<string, boolean> {
  return isRecord(value) && Object.values(value).every((v) => typeof v === 'boolean');
}

export function isProjectContext(value: unknown): value is ProjectContext {
  if (!isRecord(value)) return false;
  const { profile, project, preferences, updatedAt } = value;

  if (!isRecord(profile) || !isNonEmptyString(profile.role)) return false;
  if (!isRecord(project) || !isNonEmptyString(project.name)) return false;
  if (!isRecord(preferences) || !isNonEmptyString(preferences.language)) return false;
  if (!isNonEmptyString(updatedAt)) return false;

  return true;
}

export function isWorkflowInstance(value: unknown): value is WorkflowInstance {
  if (!isRecord(value)) return false;
  const { instanceId, workflowId, currentStepId, status, stepsData } = value;

  if (!isNonEmptyString(instanceId)) return false;
  if (!isNonEmptyString(workflowId)) return false;
  if (!isNonEmptyString(currentStepId)) return false;
  if (status !== 'IN_PROGRESS' && status !== 'COMPLETED') return false;
  if (!isRecord(stepsData)) return false;

  return Object.values(stepsData).every(
    (step) =>
      isRecord(step) &&
      isStringRecord(step.formData) &&
      isBooleanRecord(step.checklistState) &&
      typeof step.isCompleted === 'boolean',
  );
}

export function isTrainingProgress(value: unknown): value is TrainingProgress {
  if (!isRecord(value)) return false;
  const { completedModuleIds, updatedAt } = value;

  return (
    Array.isArray(completedModuleIds) &&
    completedModuleIds.every((id) => typeof id === 'string') &&
    isNonEmptyString(updatedAt)
  );
}
