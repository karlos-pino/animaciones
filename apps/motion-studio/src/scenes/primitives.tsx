import { makeScene2D, Node, Rect } from '@motion-canvas/2d';
import { waitFor } from '@motion-canvas/core';
import { colors, type } from '../../../../packages/design-tokens/src';
import {
  Arrow,
  Badge,
  Callout,
  Counter,
  FlowNode,
  Highlight,
  Label,
  Legend,
  MapPoint,
  Progress,
  SafeArea,
} from '../../../../packages/diagram-components/src';

export default makeScene2D(function* (view) {
  view.fill(colors.paper);
  view.add(<SafeArea opacity={0.5} />);
  view.add(
    <Label text="Primitivas visuales" y={-385} fontSize={type.title} fontWeight={type.strong} />,
  );
  const samples = [
    ['Label', <Label text="Texto de guía" />],
    ['Callout', <Callout text="Regla aplicada" width={300} height={60} />],
    ['Arrow', <Arrow from={{ x: -92, y: 0 }} to={{ x: 92, y: 0 }} />],
    ['FlowNode', <FlowNode text="Revisión" width={220} height={60} />],
    [
      'Highlight',
      <Node>
        <Highlight width={225} height={62} />
        <Label text="Énfasis" />
      </Node>,
    ],
    ['Badge', <Badge text="Activo" width={142} />],
    [
      'Legend',
      <Legend
        x={-116}
        items={[
          { text: 'Básico', shape: 'circle', width: 160 },
          { text: 'Interm.', shape: 'diamond', width: 144 },
        ]}
      />,
    ],
    ['Counter', <Counter value={38} fontSize={62} />],
    ['Progress', <Progress value={3} total={5} width={250} />],
    ['SafeArea', <Label text="Marco discontinuo" fontSize={type.small} />],
    [
      'MapPoint',
      <Node>
        <MapPoint x={-72} shape="circle" state="inactive" />
        <MapPoint shape="diamond" state="eligible" />
        <MapPoint x={72} shape="square" />
      </Node>,
    ],
  ] as const;
  samples.forEach(([name, sample], index) => {
    const x = -633 + (index % 4) * 422;
    const y = -218 + Math.floor(index / 4) * 177;
    view.add(
      <Rect x={x} y={y} width={398} height={150} radius={18} fill={colors.surface}>
        <Label y={-44} text={name} fontSize={type.small} fill={colors.muted} />
        <Node y={20}>{sample}</Node>
      </Rect>,
    );
  });
  yield* waitFor(5);
});
