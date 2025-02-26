import {
  createBelongsToRelation,
  createHasManyByRelation,
  createHasManyRelation,
  createHasOneRelation,
  createMorphOneRelation,
  createMorphToRelation,
} from '@rattus-orm/core/field-relations'
import { createClasslessFieldConfigFunction } from './utils'

export const belongsTo = createClasslessFieldConfigFunction(createBelongsToRelation)
export const hasMany = createClasslessFieldConfigFunction(createHasManyRelation)
export const hasManyBy = createClasslessFieldConfigFunction(createHasManyByRelation)
export const hasOne = createClasslessFieldConfigFunction(createHasOneRelation)
export const morphOne = createClasslessFieldConfigFunction(createMorphOneRelation)
export const morphTo = createClasslessFieldConfigFunction(createMorphToRelation)
