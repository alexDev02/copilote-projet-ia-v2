import type { ProjectContext } from '@/types/context';
import type { Workflow, WorkflowStep } from '@/types/workflow';

const VARIABLE_PATTERN = /\{\{([a-zA-Z]+)\.([a-zA-Z]+)\}\}/g;

const PLACEHOLDER_NON_RENSEIGNE = 'Non renseigné';

/**
 * Construit la table de résolution des variables disponibles pour un prompt,
 * organisée par namespace (user, project, preferences, workflow, step).
 */
function buildVariableTable(
  projectContext: ProjectContext | null,
  workflow: Workflow,
  step: WorkflowStep,
): Readonly<Record<string, Readonly<Record<string, string>>>> {
  return {
    user: {
      role: projectContext?.profile.role ?? PLACEHOLDER_NON_RENSEIGNE,
    },
    project: {
      name: projectContext?.project.name ?? PLACEHOLDER_NON_RENSEIGNE,
      description: projectContext?.project.description ?? PLACEHOLDER_NON_RENSEIGNE,
      objectives: projectContext?.project.objectives ?? PLACEHOLDER_NON_RENSEIGNE,
      methodology: projectContext?.project.methodology ?? PLACEHOLDER_NON_RENSEIGNE,
    },
    preferences: {
      language: projectContext?.preferences.language ?? 'Français',
      detailLevel: projectContext?.preferences.detailLevel ?? 'Standard',
    },
    workflow: {
      title: workflow.metadata.title,
      objective: workflow.objective.description,
    },
    step: {
      title: step.title,
      objective: step.objective,
    },
  };
}

/**
 * Remplace toutes les occurrences `{{namespace.key}}` dans un template par leur
 * valeur résolue. Une variable inconnue est laissée visible (préfixée) plutôt que
 * silencieusement supprimée, pour rester détectable en relecture.
 */
export function resolveTemplate(
  template: string,
  projectContext: ProjectContext | null,
  workflow: Workflow,
  step: WorkflowStep,
): string {
  const table = buildVariableTable(projectContext, workflow, step);

  return template.replace(VARIABLE_PATTERN, (fullMatch, namespace: string, key: string) => {
    const namespaceTable = table[namespace];
    const value = namespaceTable?.[key];
    return value ?? `[variable inconnue : ${fullMatch}]`;
  });
}
