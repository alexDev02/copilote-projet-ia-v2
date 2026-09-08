import type { Workflow, WorkflowSummary } from '@/types/workflow';
import prepareCopil from '@/data/workflows/governance/prepare-copil.json';

/**
 * Registre statique des workflows. Ajouter un workflow = ajouter une entrée ici
 * après avoir créé son fichier JSON dans data/workflows/. Le moteur n'a pas
 * d'autre modification à faire.
 */
const WORKFLOWS: readonly Workflow[] = [prepareCopil as Workflow];

export function getAllWorkflowSummaries(): readonly WorkflowSummary[] {
  return WORKFLOWS.map((wf) => ({ id: wf.id, metadata: wf.metadata }));
}

export function getWorkflowById(id: string): Workflow | null {
  return WORKFLOWS.find((wf) => wf.id === id) ?? null;
}
