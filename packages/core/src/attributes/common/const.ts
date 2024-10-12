import { isUnknownRecord } from '@core-shared-utils/isUnknownRecord'

import type { Relation } from '@/attributes/relations/classes/relation'
import { isArray } from '@/support/utils'

export const attributeKindKey = Symbol('attributeKind')
export const uidKind = Symbol('uid')
export const relationKind = Symbol('relation')
export const typeKind = Symbol('type')
export const morphToKind = Symbol('morphTo')

export const isKindOf = <T>(value: unknown, kind: symbol | symbol[]): value is T => {
  if (isArray(kind)) {
    return kind.some((kindPart) => isKindOf(value, kindPart))
  }
  return isUnknownRecord(value) && attributeKindKey in value && value[attributeKindKey] === kind
}

export const isRelation = (value: unknown): value is Relation => isKindOf<Relation>(value, [relationKind, morphToKind])
