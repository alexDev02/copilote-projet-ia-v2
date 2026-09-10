import type { ProjectContext } from '@/types/context';
import type { WorkflowInstance, TrainingProgress } from '@/types/progress';
import { STORAGE_KEYS } from '@/constants';
import { StorageValidationError } from '@/utils/errors';
import { logger } from '@/utils/logger';
import { isProjectContext, isWorkflowInstance, isTrainingProgress } from '@/utils/validation';

/**
 * Lit et parse une entrée localStorage, en la validant avec le type guard fourni.
 * Retourne `null` si la clé est absente ou si la donnée est corrompue (et la purge
 * dans ce dernier cas pour éviter un blocage permanent de l'utilisateur).
 */
function readValidated<T>(key: string, guard: (value: unknown) => value is T): T | null {
  const raw = window.localStorage.getItem(key);
  if (raw === null) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!guard(parsed)) {
      throw new StorageValidationError(key, 'schéma inattendu');
    }
    return parsed;
  } catch (error) {
    logger.error(`Lecture invalide pour "${key}", suppression de l'entrée corrompue.`, error);
    window.localStorage.removeItem(key);
    return null;
  }
}

function write<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const storageService = {
  getProjectContext(): ProjectContext | null {
    return readValidated(STORAGE_KEYS.PROJECT_CONTEXT, isProjectContext);
  },

  saveProjectContext(context: ProjectContext): void {
    write(STORAGE_KEYS.PROJECT_CONTEXT, context);
  },

  clearProjectContext(): void {
    window.localStorage.removeItem(STORAGE_KEYS.PROJECT_CONTEXT);
  },

  getWorkflowInstance(workflowId: string): WorkflowInstance | null {
    return readValidated(
      STORAGE_KEYS.WORKFLOW_INSTANCE_PREFIX + workflowId,
      isWorkflowInstance,
    );
  },

  saveWorkflowInstance(instance: WorkflowInstance): void {
    write(STORAGE_KEYS.WORKFLOW_INSTANCE_PREFIX + instance.workflowId, instance);
  },

  clearWorkflowInstance(workflowId: string): void {
    window.localStorage.removeItem(STORAGE_KEYS.WORKFLOW_INSTANCE_PREFIX + workflowId);
  },

  getTrainingProgress(): TrainingProgress | null {
    return readValidated(STORAGE_KEYS.TRAINING_PROGRESS, isTrainingProgress);
  },

  saveTrainingProgress(progress: TrainingProgress): void {
    write(STORAGE_KEYS.TRAINING_PROGRESS, progress);
  },

  /** Réinitialisation complète demandée par l'utilisateur (cf. critères d'acceptation MVP). */
  resetAll(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (key !== null && key.startsWith('copilote_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => window.localStorage.removeItem(key));
  },
};
