import type { Normalizer } from '../normalizer'

export type SchemaDefinition = Record<string, NormalizationSchema<any> | NormalizationSchema<any>[]>
export type Identifier = string | number
export type SchemaAttributeGetter = (input: any, parent: any) => string
export type IdentifierGetter = ((input: unknown, parent: unknown, key: unknown) => string) | string

export interface NormalizationSchema<NormalizeResult, Definition = SchemaDefinition> {
  define(definition: Definition): void
  normalize(input: unknown, parent: unknown, key: unknown, visitor: Normalizer): NormalizeResult | undefined
}
