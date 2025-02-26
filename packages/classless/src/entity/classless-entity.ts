import { Model, ModelFields, Repository, getDatabaseManager } from '@rattus-orm/core'
import { ClasslessAttributesConfig, InferTypesFromClasslessAttributesConfig } from './types'

export function defineOrmEntity<T extends ClasslessAttributesConfig>(
  entityName: string,
  fields: T,
): Repository<Model & InferTypesFromClasslessAttributesConfig<T>> {
  const model = class extends Model {
    public static entity = entityName
    public static fields() {
      return Object.entries(fields).reduce<ModelFields>(
        (result: ModelFields, [key, attributeBuilder]) => {
          result[key] = attributeBuilder(this)
          return result
        },
        {},
      )
    }
  }

  return getDatabaseManager().getRepository(model) as Repository<
    Model & InferTypesFromClasslessAttributesConfig<T>
  >
}
