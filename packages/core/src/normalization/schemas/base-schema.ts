import type { Normalizer } from '../normalizer'
import type { NormalizationSchema, SchemaDefinition } from './types'

export abstract class BaseSchema<Result, Definition = SchemaDefinition>
  implements NormalizationSchema<Result, Definition>
{
  constructor(
    public readonly key: string,
    public readonly definition: Definition,
  ) {}

  public define(definition: Definition) {
    Object.assign(this.definition as Record<string, unknown>, definition)
  }

  public abstract normalize(input: unknown, parent: unknown, key: unknown, visitor: Normalizer): Result | undefined
}
