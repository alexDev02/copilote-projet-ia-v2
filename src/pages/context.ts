import { el, mount } from '@/utils/dom';
import { createHeader } from '@/components/layout/header';
import { createButton } from '@/components/common/button';
import { createTextField, createSelectField } from '@/components/common/form-field';
import { openModal } from '@/components/common/modal';
import { showToast } from '@/components/common/toast';
import { storageService } from '@/core/storage-service';
import { buildInitializationPrompt } from '@/core/prompt-builder';
import { copyToClipboard } from '@/utils/clipboard';
import { USER_ROLES, METHODOLOGIES, DETAIL_LEVELS } from '@/types/context';
import type { ProjectContext } from '@/types/context';
import systemRules from '@/data/system-rules.json';
import type { SystemRules } from '@/types/system-rules';

interface ContextPageOptions {
  readonly onNavigateHome: () => void;
  readonly onNavigateTraining: () => void;
}

const DEFAULT_CONTEXT: ProjectContext = {
  profile: { role: 'Chef de projet IT', aiTool: 'ChatGPT', experienceLevel: 'Intermédiaire' },
  project: {
    name: '',
    description: '',
    objectives: '',
    businessSector: '',
    projectType: '',
    team: '',
    stakeholders: '',
    sponsor: '',
    methodology: 'Agile / Scrum',
  },
  preferences: {
    language: 'Français',
    detailLevel: 'Standard',
    communicationStyle: 'Professionnel et direct',
  },
  updatedAt: new Date().toISOString(),
};

export function renderContextPage(root: Element, options: ContextPageOptions): void {
  const existing = storageService.getProjectContext() ?? DEFAULT_CONTEXT;

  const header = createHeader({
    onNavigateHome: options.onNavigateHome,
    onNavigateContext: () => {
      /* déjà sur cet écran */
    },
    onNavigateTraining: options.onNavigateTraining,
  });

  // --- Section Rôle ---
  const roleSelect = createSelectField({
    id: 'role',
    label: 'Votre rôle',
    value: existing.profile.role,
    options: USER_ROLES,
    required: true,
  });

  // --- Section Projet ---
  const nameField = createTextField({
    id: 'project-name',
    label: 'Nom du projet',
    value: existing.project.name,
    required: true,
  });
  const descriptionField = createTextField({
    id: 'project-description',
    label: 'Description',
    value: existing.project.description,
    multiline: true,
  });
  const objectivesField = createTextField({
    id: 'project-objectives',
    label: 'Objectifs',
    value: existing.project.objectives,
    multiline: true,
  });
  const sectorField = createTextField({
    id: 'project-sector',
    label: 'Secteur',
    value: existing.project.businessSector,
  });
  const teamField = createTextField({
    id: 'project-team',
    label: 'Équipe',
    value: existing.project.team,
  });
  const stakeholdersField = createTextField({
    id: 'project-stakeholders',
    label: 'Parties prenantes',
    value: existing.project.stakeholders,
  });
  const sponsorField = createTextField({
    id: 'project-sponsor',
    label: 'Sponsor',
    value: existing.project.sponsor,
  });

  // --- Section Méthodologie ---
  const methodologySelect = createSelectField({
    id: 'methodology',
    label: 'Méthodologie',
    value: existing.project.methodology,
    options: METHODOLOGIES,
    required: true,
  });

  // --- Section Préférences ---
  const languageField = createTextField({
    id: 'language',
    label: 'Langue',
    value: existing.preferences.language,
  });
  const detailLevelSelect = createSelectField({
    id: 'detail-level',
    label: 'Niveau de détail',
    value: existing.preferences.detailLevel,
    options: DETAIL_LEVELS,
    required: true,
  });
  const styleField = createTextField({
    id: 'style',
    label: 'Style de communication',
    value: existing.preferences.communicationStyle,
  });

  function collectContext(): ProjectContext {
    return {
      profile: {
        ...existing.profile,
        role: roleSelect.select.value as ProjectContext['profile']['role'],
      },
      project: {
        name: nameField.input.value,
        description: descriptionField.input.value,
        objectives: objectivesField.input.value,
        businessSector: sectorField.input.value,
        projectType: existing.project.projectType,
        team: teamField.input.value,
        stakeholders: stakeholdersField.input.value,
        sponsor: sponsorField.input.value,
        methodology: methodologySelect.select.value as ProjectContext['project']['methodology'],
      },
      preferences: {
        language: languageField.input.value,
        detailLevel: detailLevelSelect.select.value as ProjectContext['preferences']['detailLevel'],
        communicationStyle: styleField.input.value,
      },
      updatedAt: new Date().toISOString(),
    };
  }

  const saveButton = createButton({
    label: 'Enregistrer',
    onClick: () => {
      storageService.saveProjectContext(collectContext());
      showToast('Contexte enregistré.');
    },
  });

  const generateButton = createButton({
    label: 'Générer mon instruction IA',
    variant: 'secondary',
    onClick: () => {
      const context = collectContext();
      storageService.saveProjectContext(context);
      const prompt = buildInitializationPrompt(systemRules as SystemRules, context);

      const promptBox = el('pre', { class: 'prompt-box' }, [prompt]);
      const copyButton = createButton({
        label: 'Copier l’instruction',
        onClick: () => {
          void copyToClipboard(prompt)
            .then(() => showToast('Instruction copiée.'))
            .catch(() => showToast('Échec de la copie.', 'error'));
        },
      });
      openModal({
        title: 'Instruction d’initialisation',
        content: [promptBox, copyButton],
      });
    },
  });

  const resetButton = createButton({
    label: 'Réinitialiser mes données',
    variant: 'ghost',
    onClick: () => {
      // eslint-disable-next-line no-alert
      if (window.confirm('Cette action supprime toutes vos données locales. Continuer ?')) {
        storageService.resetAll();
        window.location.reload();
      }
    },
  });

  const form = el('form', { class: 'context-form' }, [
    el('fieldset', { class: 'field-group' }, [el('legend', {}, ['Rôle']), roleSelect.field]),
    el('fieldset', { class: 'field-group' }, [
      el('legend', {}, ['Projet']),
      nameField.field,
      descriptionField.field,
      objectivesField.field,
      sectorField.field,
      teamField.field,
      stakeholdersField.field,
      sponsorField.field,
    ]),
    el('fieldset', { class: 'field-group' }, [
      el('legend', {}, ['Méthodologie']),
      methodologySelect.field,
    ]),
    el('fieldset', { class: 'field-group' }, [
      el('legend', {}, ['Préférences']),
      languageField.field,
      detailLevelSelect.field,
      styleField.field,
    ]),
    el('div', { class: 'form-actions' }, [saveButton, generateButton, resetButton]),
  ]);
  form.addEventListener('submit', (event) => event.preventDefault());

  const main = el('main', { id: 'main-content', class: 'page page--context' }, [
    el('h1', {}, ['Mon contexte IA']),
    el('p', { class: 'page__intro' }, [
      'Configurez une seule fois votre rôle, votre projet et vos préférences. Ce contexte alimente automatiquement tous les workflows.',
    ]),
    form,
  ]);

  mount(root, el('div', {}, [header, main]));
}
