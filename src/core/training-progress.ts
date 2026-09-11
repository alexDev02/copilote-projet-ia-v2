import type { TrainingProgress } from '@/types/progress';
import { storageService } from '@/core/storage-service';

const EMPTY_PROGRESS: TrainingProgress = { completedModuleIds: [], updatedAt: '' };

export function getTrainingProgress(): TrainingProgress {
  return storageService.getTrainingProgress() ?? EMPTY_PROGRESS;
}

export function isModuleCompleted(progress: TrainingProgress, moduleId: string): boolean {
  return progress.completedModuleIds.includes(moduleId);
}

export function toggleModuleCompletion(
  progress: TrainingProgress,
  moduleId: string,
  completed: boolean,
): TrainingProgress {
  const next: TrainingProgress = {
    completedModuleIds: completed
      ? [...new Set([...progress.completedModuleIds, moduleId])]
      : progress.completedModuleIds.filter((id) => id !== moduleId),
    updatedAt: new Date().toISOString(),
  };
  storageService.saveTrainingProgress(next);
  return next;
}
