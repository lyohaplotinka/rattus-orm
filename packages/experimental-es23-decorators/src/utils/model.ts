import type { ModelFields, ModelSchemas } from '@rattus-orm/core'
import { Model } from '@rattus-orm/core'

import type { ModelOptions } from '@/model/Model'

import { MODEL_CONSTRUCTOR_PARAMS_KEY } from '../model/const'

class ModelProtectedStaticExtractor extends Model {
  public static getSchemas() {
    return this.schemas
  }
}

export function getModelSchemas(): ModelSchemas
export function getModelSchemas(entity: string): ModelFields
export function getModelSchemas(entity?: string): ModelSchemas | ModelFields {
  const schemas = ModelProtectedStaticExtractor.getSchemas()
  return entity ? schemas[entity] : schemas
}

export function initializeModelSchemasForEntity(entity: string): ModelFields {
  const schemas = getModelSchemas()
  if (!(entity in schemas)) {
    schemas[entity] = {}
  }
  return schemas[entity]
}

export function getConstructorParameters(model: Model): { attributes?: Element; options: ModelOptions } {
  return model[MODEL_CONSTRUCTOR_PARAMS_KEY]
}
