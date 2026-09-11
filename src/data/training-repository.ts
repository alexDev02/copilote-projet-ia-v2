import type { TrainingModule } from '@/types/training';
import module01 from '@/data/training/module-01.json';
import module02 from '@/data/training/module-02.json';
import module03 from '@/data/training/module-03.json';
import module04 from '@/data/training/module-04.json';
import module05 from '@/data/training/module-05.json';

const MODULES: readonly TrainingModule[] = [
  module01 as TrainingModule,
  module02 as TrainingModule,
  module03 as TrainingModule,
  module04 as TrainingModule,
  module05 as TrainingModule,
];

export function getAllTrainingModules(): readonly TrainingModule[] {
  return MODULES;
}

export function getTrainingModuleById(id: string): TrainingModule | null {
  return MODULES.find((m) => m.id === id) ?? null;
}
