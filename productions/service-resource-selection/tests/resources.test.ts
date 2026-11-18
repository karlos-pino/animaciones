import { describe, expect, it } from 'vitest';
import {
  createResources,
  getActiveResources,
  getEligibleResources,
  request,
  resources,
  type Resource,
} from '../model/resources';

describe('selección de recursos de servicio', () => {
  it('genera exactamente 50 posiciones sintéticas, de forma repetible', () => {
    expect(resources).toHaveLength(50);
    expect(createResources()).toEqual(resources);
    expect(createResources(99)).not.toEqual(resources);
    expect(new Set(resources.map((r) => r.id)).size).toBe(50);
    expect(new Set(resources.map((r) => r.territory)).size).toBe(3);
    expect(
      resources.every((r) => [r.position.x, r.position.y].every((value) => value > 0 && value < 1)),
    ).toBe(true);
  });

  it('verifica disponibilidad, niveles y elegibilidad acumulativa', () => {
    const active = getActiveResources(resources);
    const eligible = getEligibleResources(resources, request);
    expect(active).toHaveLength(38);
    expect(resources.length - active.length).toBe(12);
    expect(active.filter((r) => r.level === 'basic')).toHaveLength(14);
    expect(active.filter((r) => r.level === 'advanced')).toHaveLength(8);
    expect(eligible).toHaveLength(16);
    expect(eligible.every((r) => r.active && r.level === 'intermediate')).toBe(true);
    expect(eligible).toEqual(getEligibleResources(active, request));
    expect(resources.filter((r) => !r.active && r.level === request.level)).toHaveLength(4);
  });

  it('preserva orden e identidad y acepta cualquier territorio', () => {
    const rearranged: Resource[] = resources
      .map<Resource>((r) => ({ ...r, territory: 'oriente' }))
      .reverse();
    const eligible = getEligibleResources(rearranged, request);
    expect(eligible.map((r) => r.id)).toEqual(
      getEligibleResources(resources, request)
        .map((r) => r.id)
        .reverse(),
    );
    expect(eligible.every((r) => rearranged.includes(r))).toBe(true);
    expect(getEligibleResources([], request)).toEqual([]);
  });
});
