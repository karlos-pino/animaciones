import { parse } from 'yaml';
import { z } from 'zod';

const text = z.string().trim().min(1);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const factId = z.string().regex(/^F[1-9][0-9]*$/);
const seconds = z.number().finite().nonnegative();
const checkpoint = z.strictObject({ id: slug, at: seconds });

export const briefSchema = z
  .strictObject({
    id: slug,
    objective: text,
    audience: text,
    facts: z.array(z.strictObject({ id: factId, statement: text, source: text })).min(1),
    output: z.strictObject({
      aspect_ratio: z.literal('16:9'),
      language: text,
      audio: z.boolean(),
    }),
    constraints: z.array(text).min(1),
  })
  .refine((value) => new Set(value.facts.map((fact) => fact.id)).size === value.facts.length, {
    path: ['facts'],
    message: 'Los IDs de hechos deben ser únicos',
  });

const sceneSchema = z
  .strictObject({
    id: slug,
    teaching_point: text,
    facts: z.array(factId).min(1),
    entities: z.array(text).min(1),
    initial_state: text,
    action: text,
    transition: text,
    final_state: text,
    duration_estimate: seconds.positive(),
    caption: text,
    checkpoint,
    entry_checkpoint: checkpoint.optional(),
    assumptions: z.array(text),
  })
  .refine(
    (scene) =>
      scene.checkpoint.at < scene.duration_estimate &&
      (!scene.entry_checkpoint || scene.entry_checkpoint.at < scene.checkpoint.at),
    {
      path: ['checkpoint'],
      message: 'Los checkpoints deben estar ordenados y dentro de la escena',
    },
  );

export const storyboardSchema = z
  .strictObject({
    production: slug,
    scenes: z.array(sceneSchema).min(1),
  })
  .superRefine(({ scenes }, context) => {
    const ids = scenes.map((scene) => scene.id);
    const checkpoints = scenes.flatMap((scene) =>
      scene.entry_checkpoint
        ? [scene.entry_checkpoint.id, scene.checkpoint.id]
        : [scene.checkpoint.id],
    );
    if (new Set(ids).size !== ids.length || new Set(checkpoints).size !== checkpoints.length) {
      context.addIssue({
        code: 'custom',
        path: ['scenes'],
        message: 'IDs de escena y checkpoint deben ser únicos',
      });
    }
    for (const [index, scene] of scenes.entries()) {
      const previous = scenes[index - 1];
      if (previous && scene.initial_state !== previous.final_state) {
        context.addIssue({
          code: 'custom',
          path: ['scenes', index, 'initial_state'],
          message: 'El estado inicial debe continuar el estado final anterior',
        });
      }
    }
  });

export type Brief = z.infer<typeof briefSchema>;
export type Storyboard = z.infer<typeof storyboardSchema>;

export function parseProduction(briefYaml: string, storyboardYaml: string) {
  const brief = briefSchema.parse(parse(briefYaml));
  const storyboard = storyboardSchema.parse(parse(storyboardYaml));
  if (brief.id !== storyboard.production) throw new Error('Los IDs de producción no coinciden');
  const facts = new Set(brief.facts.map((fact) => fact.id));
  for (const scene of storyboard.scenes) {
    for (const fact of scene.facts) {
      if (!facts.has(fact)) throw new Error(`Hecho ${fact} sin fuente en ${scene.id}`);
    }
  }
  return { brief, storyboard };
}

export function getTimeline(storyboard: Storyboard) {
  let start = 0;
  const checkpoints = storyboard.scenes.flatMap((scene) => {
    const markers = scene.entry_checkpoint
      ? [scene.entry_checkpoint, scene.checkpoint]
      : [scene.checkpoint];
    const absolute = markers.map((marker) => ({ id: marker.id, seconds: start + marker.at }));
    start += scene.duration_estimate;
    return absolute;
  });
  return { duration: start, checkpoints };
}
