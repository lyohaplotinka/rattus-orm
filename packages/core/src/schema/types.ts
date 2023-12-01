import type { NormalizationSchema } from '@/normalization/schemas/types'

export type NormalizedSchema = NormalizationSchema<any>
export type EntitySchema = NormalizationSchema<any>
export type Schemas = Record<string, NormalizationSchema<any>>
