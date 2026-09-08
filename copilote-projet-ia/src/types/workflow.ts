export const WORKFLOW_CATEGORIES = [
  'initialisation',
  'cadrage',
  'analyse',
  'planification',
  'risques',
  'gouvernance',
  'qualite',
  'deploiement',
  'change',
  'cloture',
  'agile',
] as const;
export type WorkflowCategory = (typeof WORKFLOW_CATEGORIES)[number];

export const STEP_TYPES = [
  'info',
  'input',
  'documents',
  'ai_task',
  'ai_question',
  'ai_challenge',
  'ai_production',
  'ai_review',
  'checklist',
] as const;
export type StepType = (typeof STEP_TYPES)[number];

export const DIFFICULTIES = ['debutant', 'intermediaire', 'avance'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export interface WorkflowMetadata {
  readonly title: string;
  readonly shortTitle: string;
  readonly description: string;
  readonly category: WorkflowCategory;
  readonly icon: string;
  readonly difficulty: Difficulty;
  readonly estimatedMinutes: number;
  readonly tags: readonly string[];
}

export interface WorkflowObjective {
  readonly title: string;
  readonly description: string;
}

export interface WorkflowPrerequisites {
  readonly contextRequired: boolean;
  readonly documentsRecommended: readonly string[];
}

export interface StepInputField {
  readonly id: string;
  readonly label: string;
  readonly type: 'text' | 'textarea' | 'select' | 'date';
  readonly required: boolean;
  readonly description?: string;
  readonly placeholder?: string;
  readonly options?: readonly string[];
}

export interface StepDocument {
  readonly label: string;
  readonly required: boolean;
  readonly purpose?: string;
}

export type PromptSectionType =
  'context' | 'role' | 'objective' | 'task' | 'method' | 'constraints' | 'rules' | 'output';

export interface PromptSection {
  readonly type: PromptSectionType;
  readonly title: string;
  readonly content?: string;
  readonly items?: readonly string[];
}

export interface StepPrompt {
  readonly title: string;
  readonly purpose: string;
  readonly template: string;
  readonly variables: readonly string[];
  readonly sections?: readonly PromptSection[];
}

export interface ChecklistItem {
  readonly id: string;
  readonly label: string;
  readonly required: boolean;
}

export interface StepValidation {
  readonly required: boolean;
  readonly humanValidationRequired: boolean;
  readonly instruction?: string;
  readonly checklist: readonly ChecklistItem[];
}

export interface StepNavigation {
  readonly allowBack: boolean;
  readonly allowExit: boolean;
  readonly saveProgress: boolean;
  readonly requireValidation: boolean;
}

export interface StepInstructions {
  readonly before?: string;
  readonly action: string;
  readonly after?: string;
}

export interface WorkflowStep {
  readonly id: string;
  readonly order: number;
  readonly type: StepType;
  readonly title: string;
  readonly objective: string;
  readonly why?: string;
  readonly instructions?: StepInstructions;
  readonly inputs: readonly StepInputField[];
  readonly documents: readonly StepDocument[];
  readonly prompt?: StepPrompt;
  readonly validation?: StepValidation;
  readonly navigation: StepNavigation;
}

export interface WorkflowCompletion {
  readonly message: string;
  readonly nextWorkflowSuggestions: readonly string[];
}

export type WorkflowStatus = 'draft' | 'published';

export interface Workflow {
  readonly id: string;
  readonly version: string;
  readonly status: WorkflowStatus;
  readonly metadata: WorkflowMetadata;
  readonly objective: WorkflowObjective;
  readonly prerequisites: WorkflowPrerequisites;
  readonly steps: readonly WorkflowStep[];
  readonly finalChecklist: readonly ChecklistItem[];
  readonly completion: WorkflowCompletion;
}

/** Résumé utilisé pour l'affichage catalogue, sans charger le workflow complet. */
export interface WorkflowSummary {
  readonly id: string;
  readonly metadata: WorkflowMetadata;
}
