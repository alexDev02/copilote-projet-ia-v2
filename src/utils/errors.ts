/** Levée quand une donnée lue depuis localStorage ne respecte pas le schéma attendu. */
export class StorageValidationError extends Error {
  public constructor(key: string, reason: string) {
    super(`Donnée invalide pour la clé "${key}" : ${reason}`);
    this.name = 'StorageValidationError';
  }
}

/** Levée quand un workflow ou une étape référencée n'existe pas. */
export class WorkflowNotFoundError extends Error {
  public constructor(workflowId: string) {
    super(`Workflow introuvable : "${workflowId}"`);
    this.name = 'WorkflowNotFoundError';
  }
}

/** Levée quand l'API Clipboard échoue (permissions, contexte non sécurisé, etc.). */
export class ClipboardError extends Error {
  public constructor(cause: unknown) {
    super('Impossible de copier dans le presse-papier.');
    this.name = 'ClipboardError';
    this.cause = cause;
  }
}
