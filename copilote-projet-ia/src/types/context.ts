export const USER_ROLES = [
  'Chef de projet IT',
  'PMO',
  'Scrum Master',
  'Product Owner',
  'Business Analyst',
  'QA / Test Manager',
  'Change Manager',
  'Autre',
] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const METHODOLOGIES = [
  'Agile / Scrum',
  'Kanban',
  'Cycle en V',
  'Hybride',
  'Autre',
] as const;
export type Methodology = (typeof METHODOLOGIES)[number];

export const DETAIL_LEVELS = ['Synthétique', 'Standard', 'Détaillé'] as const;
export type DetailLevel = (typeof DETAIL_LEVELS)[number];

export interface UserProfile {
  readonly role: UserRole;
  readonly aiTool: string;
  readonly experienceLevel: 'Débutant' | 'Intermédiaire' | 'À l’aise';
}

export interface ProjectInfo {
  readonly name: string;
  readonly description: string;
  readonly objectives: string;
  readonly businessSector: string;
  readonly projectType: string;
  readonly team: string;
  readonly stakeholders: string;
  readonly sponsor: string;
  readonly methodology: Methodology;
}

export interface UserPreferences {
  readonly language: string;
  readonly detailLevel: DetailLevel;
  readonly communicationStyle: string;
}

export interface ProjectContext {
  readonly profile: UserProfile;
  readonly project: ProjectInfo;
  readonly preferences: UserPreferences;
  readonly updatedAt: string;
}
