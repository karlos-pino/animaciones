import type { Node } from '@motion-canvas/2d';
import {
  all,
  chain,
  easeInOutCubic,
  easeOutCubic,
  sequence,
  waitFor,
  type ThreadGenerator,
} from '@motion-canvas/core';
import { motion, opacity } from '../../design-tokens/src';
import { excludeByKey } from '../../geometry/src';

export function Reveal(nodes: readonly Node[], duration: number = motion.reveal) {
  return all(...nodes.map((node) => node.opacity(opacity.visible, duration, easeOutCubic)));
}

export function FilterOut(nodes: readonly Node[], duration: number = motion.filter) {
  return all(...nodes.map((node) => node.opacity(opacity.hidden, duration, easeInOutCubic)));
}

export function KeepOnly(
  population: readonly Node[],
  survivors: readonly Node[],
  duration: number = motion.filter,
) {
  return FilterOut(
    excludeByKey(population, survivors, (node) => node),
    duration,
  );
}

export function CompareStates(before: Node, after: Node, duration: number = motion.transition) {
  return all(FilterOut([before], duration), Reveal([after], duration));
}

export function Decision(
  selected: Node,
  alternatives: readonly Node[],
  duration: number = motion.emphasis,
) {
  return all(
    Reveal([selected], duration),
    ...alternatives.map((node) => node.opacity(opacity.dimmed, duration, easeInOutCubic)),
  );
}

export function CauseEffect(cause: Node, effect: Node, delay = 0.25) {
  return chain(Reveal([cause]), waitFor(delay), Reveal([effect]));
}

export function Sequence(delay: number, ...steps: ThreadGenerator[]) {
  return sequence(delay, ...steps);
}

export function BeforeAfter(before: Node, after: Node, pause = 0.6) {
  return chain(Reveal([before]), waitFor(pause), CompareStates(before, after));
}
