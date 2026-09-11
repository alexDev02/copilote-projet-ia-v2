import type { Workflow, WorkflowSummary } from '@/types/workflow';
import prepareCopil from '@/data/workflows/governance/prepare-copil.json';
import reportingProjet from '@/data/workflows/governance/reporting.json';
import preparerReunion from '@/data/workflows/governance/meeting.json';
import redigerCompteRendu from '@/data/workflows/governance/compte-rendu.json';
import preparerArbitrage from '@/data/workflows/governance/preparer-arbitrage.json';
import analyserRisque from '@/data/workflows/risks/risk-analysis.json';
import planAction from '@/data/workflows/risks/plan-action.json';
import cahierDesCharges from '@/data/workflows/scoping/cahier-des-charges.json';
import analyserBesoin from '@/data/workflows/analysis/analyser-besoin.json';
import construirePlanning from '@/data/workflows/planning/construire-planning.json';
import strategieDeTests from '@/data/workflows/quality/strategie-de-tests.json';
import analyserAnomalie from '@/data/workflows/quality/analyser-anomalie.json';
import preparerGoLive from '@/data/workflows/deployment/preparer-go-live.json';
import communicationProjet from '@/data/workflows/change/communication-projet.json';
import rexProjet from '@/data/workflows/closure/rex-projet.json';

/**
 * Registre statique des workflows. Ajouter un workflow = ajouter une entrée ici
 * après avoir créé son fichier JSON dans data/workflows/. Le moteur n'a pas
 * d'autre modification à faire.
 */
const WORKFLOWS: readonly Workflow[] = [
  // P0
  prepareCopil as Workflow,
  reportingProjet as Workflow,
  analyserRisque as Workflow,
  preparerReunion as Workflow,
  redigerCompteRendu as Workflow,
  // P1
  cahierDesCharges as Workflow,
  analyserBesoin as Workflow,
  construirePlanning as Workflow,
  strategieDeTests as Workflow,
  analyserAnomalie as Workflow,
  preparerGoLive as Workflow,
  communicationProjet as Workflow,
  preparerArbitrage as Workflow,
  rexProjet as Workflow,
  planAction as Workflow,
];

export function getAllWorkflowSummaries(): readonly WorkflowSummary[] {
  return WORKFLOWS.map((wf) => ({ id: wf.id, metadata: wf.metadata }));
}

export function getWorkflowById(id: string): Workflow | null {
  return WORKFLOWS.find((wf) => wf.id === id) ?? null;
}
