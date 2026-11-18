import { Circle, makeScene2D, Node, Rect } from '@motion-canvas/2d';
import { all, createRef, waitFor } from '@motion-canvas/core';
import { colors, type } from '../../../../packages/design-tokens/src';
import { Label } from '../../../../packages/diagram-components/src';
import {
  BeforeAfter,
  CauseEffect,
  CompareStates,
  Decision,
  FilterOut,
  KeepOnly,
  Reveal,
  Sequence,
} from '../../../../packages/motion-primitives/src';

export default makeScene2D(function* (view) {
  view.fill(colors.paper);
  view.add(
    <Label text="Patrones de movimiento" y={-380} fontSize={type.title} fontWeight={type.strong} />,
  );
  const examples = [
    {
      name: 'Reveal',
      initially: [0, 0, 0],
      play: (a: Node, b: Node, c: Node) => Reveal([a, b, c]),
    },
    { name: 'FilterOut', initially: [1, 1, 1], play: (a: Node) => FilterOut([a]) },
    {
      name: 'KeepOnly',
      initially: [1, 1, 1],
      play: (a: Node, b: Node, c: Node) => KeepOnly([a, b, c], [b]),
    },
    {
      name: 'CompareStates',
      initially: [1, 0, 0],
      play: (a: Node, b: Node) => CompareStates(a, b),
    },
    {
      name: 'Decision',
      initially: [1, 0, 1],
      play: (a: Node, b: Node, c: Node) => Decision(b, [a, c]),
    },
    { name: 'CauseEffect', initially: [0, 0, 0], play: (a: Node, b: Node) => CauseEffect(a, b) },
    {
      name: 'Sequence',
      initially: [0, 0, 0],
      play: (a: Node, b: Node, c: Node) => Sequence(0.25, Reveal([a]), Reveal([b]), Reveal([c])),
    },
    { name: 'BeforeAfter', initially: [0, 0, 0], play: (a: Node, b: Node) => BeforeAfter(a, b) },
  ];
  const animations = examples.map(({ name, initially, play }, index) => {
    const a = createRef<Node>(),
      b = createRef<Node>(),
      c = createRef<Node>();
    view.add(
      <Rect
        x={-633 + (index % 4) * 422}
        y={-125 + Math.floor(index / 4) * 260}
        width={398}
        height={225}
        radius={22}
        fill={colors.surface}
      >
        <Label text={name} y={-55} fontSize={type.body} />
        <Circle ref={a} x={-90} y={25} size={36} fill={colors.blue} opacity={initially[0]} />
        <Rect ref={b} y={25} size={34} rotation={45} fill={colors.teal} opacity={initially[1]} />
        <Rect ref={c} x={90} y={25} size={36} fill={colors.rust} opacity={initially[2]} />
      </Rect>,
    );
    return play(a(), b(), c());
  });
  yield* waitFor(1.25);
  yield* all(...animations);
  yield* waitFor(3);
});
