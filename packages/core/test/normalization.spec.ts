import { normalize, schema } from 'normalizr'
import { describe, expect, it } from 'vitest'

import { Normalizer } from '../src/normalization/normalizer'
import { ArrayNormalizationSchema } from '../src/normalization/schemas/array-normalization-schema'
import { EntityNormalizationSchema } from '../src/normalization/schemas/entity-normalization-schema'
import type { NormalizationSchema } from '../src/normalization/schemas/types'
import { UnionNormalizationSchema } from '../src/normalization/schemas/union-normalization-schema'

const getNormalizerResult = (inputData: any, schema: NormalizationSchema<unknown>) => {
  const normalizer = new Normalizer()
  return normalizer.normalize(inputData, schema)
}

describe('Custom normalization', () => {
  it('Entity normalization works the same way as in Normalizr', () => {
    const inputData = { id: 666, users: [{ id: 1 }, { id: 2 }] }

    const normalizrUserSchema = new schema.Entity('users')
    const normalizrTestSchema = new schema.Entity('mySchema', { users: [normalizrUserSchema] })
    const normalizrParsed = normalize(inputData, normalizrTestSchema)

    const customUserSchema = new EntityNormalizationSchema('users')
    const customTestSchema = new EntityNormalizationSchema('mySchema', { users: [customUserSchema] })
    const customParsed = getNormalizerResult(inputData, customTestSchema)

    expect(customParsed).toStrictEqual(normalizrParsed)
  })

  it('Array normalization works the same way as in Normalizr', () => {
    const inputData = [
      { id: '123', name: 'Jim' },
      { id: '456', name: 'Jane' },
    ]

    const normalizrUserSchema = new schema.Entity('users')
    const normalizrUserListSchema = new schema.Array(normalizrUserSchema)
    const normalizrParsed = normalize(inputData, normalizrUserListSchema)

    const customUserSchema = new EntityNormalizationSchema('users')
    const customUserListSchema = new ArrayNormalizationSchema(customUserSchema)
    const customParsed = getNormalizerResult(inputData, customUserListSchema)

    expect(customParsed).toStrictEqual(normalizrParsed)
  })

  it('Array with schema mapping works the same way as in Normalizr', () => {
    const inputData = [
      { id: 1, type: 'admin' },
      { id: 2, type: 'user' },
    ]

    const normalizrUserSchema = new schema.Entity('users')
    const normalizrAdminSchema = new schema.Entity('admins')
    const normalizrTestSchema = new schema.Array(
      {
        admins: normalizrAdminSchema,
        users: normalizrUserSchema,
      },
      (input) => `${input.type}s`,
    )
    const normlizrParsed = normalize(inputData, normalizrTestSchema)

    const customUserSchema = new EntityNormalizationSchema('users')
    const customAdminSchema = new EntityNormalizationSchema('admins')
    const custromTestSchema = new ArrayNormalizationSchema(
      {
        admins: customAdminSchema,
        users: customUserSchema,
      },
      (input) => `${input.type}s`,
    )
    const customPayload = getNormalizerResult(inputData, custromTestSchema)

    expect(customPayload).toStrictEqual(normlizrParsed)
  })

  it('Union normalization works the same way as in Normalizr', () => {
    const inputData = { id: 666, owner: { id: 1, type: 'user', name: 'Anne' } }

    const normalizrUserSchema = new schema.Entity('users')
    const normalizrGroupSchema = new schema.Entity('groups')
    const normalizrUnionSchema = new schema.Union({ user: normalizrUserSchema, group: normalizrGroupSchema }, 'type')
    const normalizrTestSchema = new schema.Entity('withOwner', { owner: normalizrUnionSchema })
    const normalizrParsed = normalize(inputData, normalizrTestSchema)

    const customUserSchema = new EntityNormalizationSchema('users')
    const customGroupSchema = new EntityNormalizationSchema('groups')
    const customUnionSchema = new UnionNormalizationSchema(
      { user: customUserSchema, group: customGroupSchema },
      (input) => input.type,
    )
    const customTestSchema = new EntityNormalizationSchema('withOwner', { owner: customUnionSchema })
    const customParsed = getNormalizerResult(inputData, customTestSchema)

    expect(customParsed).toStrictEqual(normalizrParsed)
  })
})
