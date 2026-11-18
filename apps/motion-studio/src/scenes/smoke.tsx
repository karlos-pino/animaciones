import { Circle, makeScene2D, Txt } from '@motion-canvas/2d';
import { createRef, easeInOutCubic, waitFor } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  view.fill('#12232e');
  const dot = createRef<Circle>();
  view.add(<Txt y={-100} fill="#f0f8f6" fontSize={64} text="Estudio de animación" />);
  view.add(<Circle ref={dot} x={-200} size={90} fill="#4de0ae" />);
  yield* waitFor(0.5);
  yield* dot().x(200, 1, easeInOutCubic);
  yield* waitFor(0.5);
});
