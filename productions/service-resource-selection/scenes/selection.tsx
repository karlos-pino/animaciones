import { Line, makeScene2D, Node, Rect } from '@motion-canvas/2d';
import { createSignal, waitFor } from '@motion-canvas/core';
import { colors, motion, type } from '../../../packages/design-tokens/src';
import {
  Counter,
  Label,
  Legend,
  MapPoint,
  type MarkerShape,
} from '../../../packages/diagram-components/src';
import { excludeByKey, projectToBox, type Box } from '../../../packages/geometry/src';
import { FilterOut, KeepOnly, Reveal } from '../../../packages/motion-primitives/src';
import { mapWindow, markerSize, projectResource, regions } from '../model/layout';
import { getActiveResources, getEligibleResources, request, resources } from '../model/resources';
import { moment } from './story';

const active = getActiveResources(resources);
const eligible = getEligibleResources(resources, request);
const inactive = excludeByKey(resources, active, (resource) => resource.id);
const wrongLevel = excludeByKey(active, eligible, (resource) => resource.id);
const shape = { basic: 'circle', intermediate: 'diamond', advanced: 'square' } satisfies Record<
  string,
  MarkerShape
>;

function leftLabel(
  text: string | (() => string),
  x: number,
  y: number,
  width: number,
  fontSize: number,
  fill: string,
  fontWeight: number = type.regular,
) {
  return (
    <Label
      text={text}
      x={x + width / 2}
      y={y}
      width={width}
      textAlign="left"
      fontSize={fontSize}
      fill={fill}
      fontWeight={fontWeight}
    />
  );
}

function panel(box: Box, fill: string, radius = 26) {
  return (
    <Rect
      x={box.x + box.width / 2}
      y={box.y + box.height / 2}
      width={box.width}
      height={box.height}
      radius={radius}
      fill={fill}
    />
  );
}

const basemap = projectToBox(mapWindow);
function path(points: readonly [number, number][]) {
  return points.map(([x, y]) => {
    const point = basemap({ x, y });
    return [point.x, point.y] as [number, number];
  });
}

function Basemap() {
  const west = path([
    [0, 0],
    [0.31, 0],
    [0.35, 0.17],
    [0.31, 0.36],
    [0.36, 0.58],
    [0.29, 0.74],
    [0.33, 1],
    [0, 1],
  ]);
  const east = path([
    [0.69, 0],
    [1, 0],
    [1, 1],
    [0.66, 1],
    [0.69, 0.82],
    [0.64, 0.57],
    [0.71, 0.34],
    [0.65, 0.16],
  ]);
  return (
    <Node>
      {panel(mapWindow, colors.map, 12)}
      <Line points={west} closed fill={colors.mapAlt} />
      <Line points={east} closed fill={colors.mapAlt} />
      {[0.12, 0.3, 0.48, 0.66, 0.84].map((y) => (
        <Line
          points={path([
            [0.015, y],
            [0.985, y],
          ])}
          stroke={colors.surface}
          opacity={0.54}
          lineWidth={1.5}
        />
      ))}
      {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((x) => (
        <Line
          points={path([
            [x, 0.025],
            [x, 0.975],
          ])}
          stroke={colors.surface}
          opacity={0.54}
          lineWidth={1.5}
        />
      ))}
      <Line points={west.slice(1, -1)} stroke={colors.line} lineWidth={2} />
      <Line
        points={path([
          [0.69, 0],
          [0.65, 0.16],
          [0.71, 0.34],
          [0.64, 0.57],
          [0.69, 0.82],
          [0.66, 1],
        ])}
        stroke={colors.line}
        lineWidth={2}
      />
    </Node>
  );
}

interface Presentation {
  stage: string;
  heading: string;
  detail: [string, string];
  metric: string;
  note: string;
}

const initial: Presentation = {
  stage: 'POBLACIÓN INICIAL',
  heading: 'Recursos registrados',
  detail: [moment('population').caption, 'La forma indica el nivel.'],
  metric: 'recursos en el mapa',
  note: 'La diagonal marca inactividad.',
};

export default makeScene2D(function* (view) {
  view.fill(colors.paper);
  const read = createSignal<Presentation>(initial);
  const currentCount = createSignal(resources.length);
  const knownActive = createSignal(false);
  const knownEligible = createSignal(false);
  const showRequest = createSignal(false);

  view.add(
    <Node>
      <Rect x={-850} y={-442} width={60} height={8} radius={4} fill={colors.teal} />
      {leftLabel('ASIGNACIÓN DE SERVICIOS', -802, -442, 800, type.small, colors.teal, type.strong)}
      {leftLabel('Selección de recursos', -880, -361, 1600, 86, colors.ink, type.strong)}
      {leftLabel(
        'De la población registrada a los recursos elegibles',
        -876,
        -279,
        1600,
        type.body,
        colors.muted,
      )}
      {panel(regions.map, colors.surface)}
      {leftLabel('Mapa esquemático', -846, -183, 640, type.body, colors.ink, type.strong)}
      <Label
        text="Ubicaciones sintéticas"
        x={128}
        y={-183}
        width={340}
        textAlign="right"
        fontSize={type.small}
        fill={colors.muted}
      />
      <Basemap />
      <Legend
        x={-828}
        y={344}
        items={[
          { text: 'Básico', shape: 'circle', width: 157 },
          { text: 'Intermedio', shape: 'diamond', width: 212 },
          { text: 'Avanzado', shape: 'square', width: 182 },
          { text: 'Inactivo', shape: 'circle', state: 'inactive', width: 177 },
          { text: 'Excluido', shape: 'square', state: 'excluded', width: 181 },
          { text: 'Elegible', shape: 'diamond', state: 'eligible', width: 176 },
        ]}
      />
      {panel(regions.panel, colors.dark)}
      {leftLabel(() => read().stage, 394, -176, 448, type.small, colors.mint, type.strong)}
      {leftLabel(() => read().heading, 394, -104, 448, 40, colors.white, type.strong)}
      {leftLabel(() => read().detail[0], 394, -45, 448, type.small, colors.white)}
      {leftLabel(() => read().detail[1], 394, -9, 448, type.small, colors.white)}
      <Line
        points={[
          [394, 45],
          [844, 45],
        ]}
        stroke={colors.mint}
        opacity={0.52}
        lineWidth={2}
      />
      <Counter
        x={514}
        y={152}
        width={240}
        textAlign="left"
        value={currentCount}
        fill={colors.mint}
        fontSize={138}
      />
      {leftLabel(() => read().metric, 396, 244, 448, 33, colors.white, type.medium)}
      {leftLabel(() => read().note, 398, 325, 448, type.small, colors.mint)}
      <Line
        points={[
          [394, 288],
          [844, 288],
        ]}
        stroke={colors.mint}
        opacity={0.34}
        lineWidth={2}
      />
      {leftLabel(
        () => `${resources.length} registrados`,
        -878,
        448,
        282,
        type.small,
        colors.ink,
        type.strong,
      )}
      <Node opacity={() => Number(knownActive())}>
        {leftLabel(
          () => `→   ${active.length} disponibles`,
          -608,
          448,
          294,
          type.small,
          colors.ink,
          type.strong,
        )}
      </Node>
      <Node opacity={() => Number(knownEligible())}>
        {leftLabel(
          () => `→   ${eligible.length} elegibles`,
          -308,
          448,
          280,
          type.small,
          colors.teal,
          type.strong,
        )}
      </Node>
      <Node opacity={() => Number(showRequest())}>
        <MapPoint x={496} y={448} shape={shape[request.level]} />
        {leftLabel('Solicitud de nivel intermedio', 524, 448, 356, type.small, colors.muted)}
      </Node>
    </Node>,
  );

  const excludedIds = createSignal<ReadonlySet<string>>(new Set());
  const highlightEligible = createSignal(false);
  const eligibleIds = new Set(eligible.map((resource) => resource.id));
  const markers = new Map<string, Node>();
  for (const resource of resources) {
    const point = projectResource(resource.position);
    const marker = (
      <MapPoint
        x={point.x}
        y={point.y}
        shape={shape[resource.level]}
        size={markerSize}
        opacity={0}
        state={() => {
          if (highlightEligible() && eligibleIds.has(resource.id)) return 'eligible';
          if (excludedIds().has(resource.id)) return 'excluded';
          return resource.active ? 'active' : 'inactive';
        }}
      />
    );
    markers.set(resource.id, marker);
    view.add(marker);
  }
  const nodes = (group: typeof resources) =>
    group.map((resource) => {
      const marker = markers.get(resource.id);
      if (!marker) throw new Error(`Marcador ausente: ${resource.id}`);
      return marker;
    });
  const showExclusions = (group: typeof resources) =>
    excludedIds(new Set(group.map((resource) => resource.id)));
  const allMarkers = nodes(resources);
  const activeMarkers = nodes(active);
  const eligibleMarkers = nodes(eligible);

  yield* Reveal(allMarkers);
  yield* waitFor(moment('population').duration_estimate - motion.reveal);

  read({
    stage: 'REGLA 1 · DISPONIBILIDAD',
    heading: 'Solo recursos activos',
    detail: [moment('availability').caption, 'Los activos conservan su posición.'],
    metric: 'recursos en el mapa',
    note: `${inactive.length} inactivos por retirar.`,
  });
  yield* waitFor(0.8);
  showExclusions(inactive);
  yield* waitFor(0.6);
  yield* FilterOut(nodes(inactive));
  currentCount(active.length);
  knownActive(true);
  read({
    ...read(),
    metric: 'recursos disponibles',
    note: `${inactive.length} inactivos retirados.`,
  });
  yield* waitFor(moment('availability').duration_estimate - 0.8 - 0.6 - motion.filter);

  showRequest(true);
  read({
    stage: 'SOLICITUD',
    heading: 'Nivel intermedio',
    detail: ['Se requiere un recurso', 'de nivel intermedio.'],
    metric: 'recursos disponibles',
    note: 'Se exige el nivel exacto.',
  });
  yield* waitFor(moment('request').duration_estimate);

  read({
    stage: 'REGLA 2 · NIVEL',
    heading: 'Coincidencia exacta',
    detail: ['Excluir los niveles básico', 'y avanzado entre los activos.'],
    metric: 'recursos disponibles',
    note: `${wrongLevel.length} quedan fuera por nivel.`,
  });
  yield* waitFor(0.8);
  showExclusions(wrongLevel);
  yield* waitFor(0.6);
  yield* KeepOnly(activeMarkers, eligibleMarkers);
  highlightEligible(true);
  currentCount(eligible.length);
  knownEligible(true);
  read({
    ...read(),
    metric: 'recursos elegibles',
    note: `${wrongLevel.length} excluidos por nivel.`,
  });
  yield* waitFor(moment('level').duration_estimate - 0.8 - 0.6 - motion.filter);

  showRequest(false);
  read({
    stage: 'RESULTADO',
    heading: 'Recursos elegibles',
    detail: ['1. Están activos.', '2. Son de nivel intermedio.'],
    metric: 'cumplen ambos criterios',
    note: 'El territorio no se filtra.',
  });
  yield* waitFor(moment('result').duration_estimate);
});
