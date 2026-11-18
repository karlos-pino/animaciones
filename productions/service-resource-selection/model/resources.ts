export const levels = ['basic', 'intermediate', 'advanced'] as const;
export type Level = (typeof levels)[number];
export type Territory = 'occidente' | 'centro' | 'oriente';

export interface Resource {
  id: string;
  position: { x: number; y: number };
  active: boolean;
  territory: Territory;
  level: Level;
}

export interface ResourceRequest {
  level: Level;
}

export const request: ResourceRequest = { level: 'intermediate' };
export const datasetSeed = 20261117;

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

const groups: ReadonlyArray<{ active: boolean; level: Level; count: number }> = [
  { active: true, level: 'basic', count: 14 },
  { active: true, level: 'intermediate', count: 16 },
  { active: true, level: 'advanced', count: 8 },
  ...levels.map((level) => ({ active: false, level, count: 4 })),
];

export function createResources(seed = datasetSeed): Resource[] {
  const random = seededRandom(seed);
  const pool = groups.flatMap(({ count, ...attributes }) =>
    Array.from({ length: count }, () => attributes),
  );

  return Array.from({ length: pool.length }, (_, index) => {
    const [attributes] = pool.splice(Math.floor(random() * pool.length), 1);
    if (!attributes) throw new Error('Distribución de recursos incompleta');
    const row = Math.floor(index / 10);
    const stagger = row % 2 === 0 ? -0.12 : 0.12;
    const x = ((index % 10) + 0.5 + stagger + (random() - 0.5) * 0.4) / 10;
    const y = (row + 0.5 + (random() - 0.5) * 0.22) / 5;
    const territory = x < 1 / 3 ? 'occidente' : x < 2 / 3 ? 'centro' : 'oriente';
    return {
      id: `R-${String(index + 1).padStart(2, '0')}`,
      position: { x, y },
      territory,
      ...attributes,
    };
  });
}

export function getActiveResources(resources: readonly Resource[]): Resource[] {
  return resources.filter((resource) => resource.active);
}

export function getEligibleResources(
  resources: readonly Resource[],
  criterion: ResourceRequest,
): Resource[] {
  return getActiveResources(resources).filter((resource) => resource.level === criterion.level);
}

export const resources = createResources();
