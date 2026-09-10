import type { SystemRules } from '@/types/system-rules';
import type { ProjectContext } from '@/types/context';
import type { Workflow, WorkflowStep } from '@/types/workflow';
import { resolveTemplate } from '@/core/variable-resolver';

const NON_RENSEIGNE = 'Non renseigné';

function buildSystemRulesSection(systemRules: SystemRules): readonly string[] {
  const lines = ['[RÔLE ET CONSIGNES IA]', systemRules.tone, 'Garde-fous stricts :'];
  systemRules.guardrails.forEach((rule) => lines.push(`- ${rule}`));
  return lines;
}

function buildProjectContextSection(projectContext: ProjectContext | null): readonly string[] {
  if (projectContext === null) {
    return [
      '',
      '[CONTEXTE DU PROJET]',
      'Aucun contexte projet configuré. Demande les informations manquantes avant de produire un résultat.',
    ];
  }

  const { profile, project, preferences } = projectContext;
  return [
    '',
    '[CONTEXTE DU PROJET]',
    `- Rôle utilisateur : ${profile.role}`,
    `- Projet : ${project.name}`,
    `- Description : ${project.description || NON_RENSEIGNE}`,
    `- Secteur : ${project.businessSector || NON_RENSEIGNE}`,
    `- Méthodologie : ${project.methodology}`,
    `- Style attendu : ${preferences.communicationStyle || 'Professionnel'}, niveau ${preferences.detailLevel}`,
    `- Langue de réponse : ${preferences.language}`,
  ];
}

function buildStepObjectiveSection(step: WorkflowStep): readonly string[] {
  return ['', `[OBJECTIF DE L'ÉTAPE — ${step.title}]`, step.objective];
}

function buildStepInputsSection(
  step: WorkflowStep,
  stepInputs: Readonly<Record<string, string>>,
): readonly string[] {
  if (step.inputs.length === 0) return [];

  const lines = ['', '[DONNÉES FOURNIES POUR CETTE ÉTAPE]'];
  step.inputs.forEach((input) => {
    const value = stepInputs[input.id];
    lines.push(`- ${input.label} : ${value && value.length > 0 ? value : NON_RENSEIGNE}`);
  });
  return lines;
}

function buildInstructionSection(
  step: WorkflowStep,
  workflow: Workflow,
  projectContext: ProjectContext | null,
): readonly string[] {
  if (!step.prompt) return [];

  const resolved = resolveTemplate(step.prompt.template, projectContext, workflow, step);
  return ['', "[INSTRUCTION POUR L'IA]", resolved];
}

/**
 * Assemble le prompt final destiné à être copié dans l'outil IA de l'utilisateur.
 * Ordre fixe : règles système -> contexte projet -> objectif de l'étape ->
 * saisies utilisateur -> instruction métier de l'étape.
 */
export function buildFinalPrompt(
  systemRules: SystemRules,
  projectContext: ProjectContext | null,
  workflow: Workflow,
  step: WorkflowStep,
  stepInputs: Readonly<Record<string, string>>,
): string {
  const parts: string[] = [
    ...buildSystemRulesSection(systemRules),
    ...buildProjectContextSection(projectContext),
    ...buildStepObjectiveSection(step),
    ...buildStepInputsSection(step, stepInputs),
    ...buildInstructionSection(step, workflow, projectContext),
  ];

  return parts.join('\n');
}

/** Prompt d'initialisation généré depuis l'écran "Mon contexte IA". */
export function buildInitializationPrompt(
  systemRules: SystemRules,
  projectContext: ProjectContext,
): string {
  const { profile, project, preferences } = projectContext;

  const parts = [
    ...buildSystemRulesSection(systemRules),
    '',
    '[CONTEXTE DE COLLABORATION]',
    `Tu vas m'assister tout au long du projet suivant. Ce message établit le contexte de référence pour nos échanges futurs.`,
    '',
    `- Mon rôle : ${profile.role}`,
    `- Projet : ${project.name}`,
    `- Description : ${project.description || NON_RENSEIGNE}`,
    `- Objectifs : ${project.objectives || NON_RENSEIGNE}`,
    `- Secteur : ${project.businessSector || NON_RENSEIGNE}`,
    `- Méthodologie : ${project.methodology}`,
    `- Équipe : ${project.team || NON_RENSEIGNE}`,
    `- Parties prenantes : ${project.stakeholders || NON_RENSEIGNE}`,
    `- Niveau de détail attendu : ${preferences.detailLevel}`,
    `- Langue : ${preferences.language}`,
    '',
    '[RÈGLES DE COLLABORATION]',
    '- Base-toi uniquement sur les informations que je te fournis dans cette conversation.',
    '- Si une information te manque, pose-moi la question avant de produire un résultat.',
    '- Distingue toujours les faits des hypothèses.',
  ];

  return parts.join('\n');
}
