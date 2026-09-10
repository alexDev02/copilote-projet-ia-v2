export interface TrainingSection {
  readonly heading: string;
  readonly paragraphs: readonly string[];
  readonly bullets?: readonly string[];
}

export interface TrainingModule {
  readonly id: string;
  readonly order: number;
  readonly title: string;
  readonly summary: string;
  readonly estimatedMinutes: number;
  readonly sections: readonly TrainingSection[];
  readonly keyTakeaways: readonly string[];
}
