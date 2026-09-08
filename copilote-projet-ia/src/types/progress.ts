export type WorkflowInstanceStatus = 'IN_PROGRESS' | 'COMPLETED';

export interface StepProgress {
  readonly formData: Readonly<Record<string, string>>;
  readonly checklistState: Readonly<Record<string, boolean>>;
  readonly isCompleted: boolean;
}

export interface WorkflowInstance {
  readonly instanceId: string;
  readonly workflowId: string;
  readonly currentStepId: string;
  readonly status: WorkflowInstanceStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly stepsData: Readonly<Record<string, StepProgress>>;
}

export interface TrainingProgress {
  readonly completedModuleIds: readonly string[];
  readonly updatedAt: string;
}
