import { Circle, Line, Node, Rect, Txt, type NodeProps, type TxtProps } from '@motion-canvas/2d';
import type { SignalValue } from '@motion-canvas/core';
import { canvas, colors, spacing, type } from '../../design-tokens/src';
import { progressFraction, type Point } from '../../geometry/src';

export function Label(props: TxtProps) {
  const config = {
    fontFamily: type.family,
    fontSize: type.body,
    fontWeight: type.regular,
    fill: colors.ink,
    ...props,
  };
  const { width, fontFamily, fontSize, fontWeight, text } = config;
  if (
    typeof width !== 'number' ||
    typeof fontSize !== 'number' ||
    typeof fontFamily !== 'string' ||
    (typeof fontWeight !== 'number' && typeof fontWeight !== 'string') ||
    !text
  )
    return <Txt {...config} />;

  const measure = document.createElement('canvas').getContext('2d');
  if (!measure) throw new Error('Contexto 2D no disponible para medir texto');
  measure.font = `${fontWeight} ${fontSize}px "${fontFamily}"`;
  let previous: string | undefined;
  return (
    <Txt
      {...config}
      text={() => {
        const value = typeof text === 'function' ? text() : text;
        if (
          value !== previous &&
          value.split('\n').some((line) => measure.measureText(line).width > width)
        ) {
          throw new Error(`Texto fuera de su ancho de ${width}px: ${value}`);
        }
        previous = value;
        return value;
      }}
    />
  );
}

interface PanelProps extends NodeProps {
  text: SignalValue<string>;
  width: number;
  height?: number;
}

export function Callout({ text, width, height = 88, ...props }: PanelProps) {
  return (
    <Rect {...props} width={width} height={height} radius={spacing.radius} fill={colors.dark}>
      <Label text={text} fill={colors.white} fontWeight={type.medium} />
    </Rect>
  );
}

export function Arrow({
  from,
  to,
  color = colors.teal,
}: {
  from: Point;
  to: Point;
  color?: string;
}) {
  return (
    <Line
      points={[
        [from.x, from.y],
        [to.x, to.y],
      ]}
      lineWidth={4}
      stroke={color}
      endArrow
      arrowSize={16}
    />
  );
}

export function FlowNode({ text, width, height = 72, ...props }: PanelProps) {
  return (
    <Rect
      {...props}
      width={width}
      height={height}
      radius={16}
      fill={colors.surface}
      stroke={colors.blue}
      lineWidth={3}
    >
      <Label text={text} fontWeight={type.medium} />
    </Rect>
  );
}

export function Highlight({
  width,
  height,
  ...props
}: NodeProps & { width: number; height: number }) {
  return (
    <Rect {...props} width={width} height={height} radius={16} stroke={colors.teal} lineWidth={4} />
  );
}

export function Badge({ text, width, height = 44, ...props }: PanelProps) {
  return (
    <Rect {...props} width={width} height={height} radius={height / 2} fill={colors.mint}>
      <Label text={text} fontSize={type.small} fontWeight={type.strong} fill={colors.dark} />
    </Rect>
  );
}

export type MarkerShape = 'circle' | 'diamond' | 'square';
type MarkerState = 'active' | 'inactive' | 'excluded' | 'eligible';

interface MapPointProps extends NodeProps {
  shape: MarkerShape;
  size?: number;
  state?: SignalValue<MarkerState>;
}

export function MapPoint({ shape, state = 'active', size = 25, ...props }: MapPointProps) {
  const current = () => (typeof state === 'function' ? state() : state);
  const fill = () =>
    current() === 'eligible'
      ? colors.teal
      : current() === 'excluded'
        ? colors.rust
        : current() === 'inactive'
          ? colors.inactive
          : colors.blue;
  const hollow = () => current() === 'inactive';
  const glyph = {
    size: shape === 'diamond' ? size * 0.8 : size,
    fill: () => (hollow() ? colors.surface : fill()),
    stroke: fill,
    lineWidth: 3,
  };
  return (
    <Node {...props}>
      <Circle
        size={size * 1.56}
        stroke={colors.teal}
        lineWidth={3}
        opacity={() => Number(current() === 'eligible')}
      />
      {shape === 'circle' ? (
        <Circle {...glyph} />
      ) : (
        <Rect
          {...glyph}
          rotation={shape === 'diamond' ? 45 : 0}
          radius={shape === 'square' ? 2 : 0}
        />
      )}
      <Line
        points={[
          [-size * 0.63, size * 0.63],
          [size * 0.63, -size * 0.63],
        ]}
        stroke={colors.surface}
        lineWidth={6}
        opacity={() => Number(current() === 'inactive' || current() === 'excluded')}
      />
      <Line
        points={[
          [-size * 0.6, size * 0.6],
          [size * 0.6, -size * 0.6],
        ]}
        stroke={fill}
        lineWidth={2.2}
        opacity={() => Number(current() === 'inactive' || current() === 'excluded')}
      />
    </Node>
  );
}

export interface LegendItem {
  text: string;
  shape: MarkerShape;
  state?: MarkerState;
  width: number;
}

export function Legend({ items, ...props }: NodeProps & { items: readonly LegendItem[] }) {
  let cursor = 0;
  return (
    <Node {...props}>
      {items.map(({ width, text, ...glyph }) => {
        const x = cursor;
        cursor += width;
        return (
          <Node x={x}>
            <MapPoint {...glyph} size={22} />
            <Label
              x={width / 2 + 12}
              width={width - 48}
              textAlign="left"
              fontSize={type.small}
              text={text}
            />
          </Node>
        );
      })}
    </Node>
  );
}

export function Counter({ value, ...props }: TxtProps & { value: SignalValue<number> }) {
  return (
    <Label
      fontSize={type.metric}
      fontWeight={type.strong}
      {...props}
      text={() =>
        new Intl.NumberFormat('es-CO').format(typeof value === 'function' ? value() : value)
      }
    />
  );
}

export function Progress({
  value,
  total,
  width,
  ...props
}: NodeProps & {
  value: SignalValue<number>;
  total: number;
  width: number;
}) {
  const filled = () =>
    width * progressFraction(typeof value === 'function' ? value() : value, total);
  return (
    <Node {...props}>
      <Rect width={width} height={12} radius={6} fill={colors.grid} />
      <Rect
        width={filled}
        x={() => (filled() - width) / 2}
        height={12}
        radius={6}
        fill={colors.teal}
      />
    </Node>
  );
}

export function SafeArea(props: NodeProps) {
  return (
    <Rect
      {...props}
      width={canvas.width - 2 * canvas.safeX}
      height={canvas.height - 2 * canvas.safeY}
      stroke={colors.blue}
      lineWidth={2}
      lineDash={[12, 10]}
    />
  );
}
