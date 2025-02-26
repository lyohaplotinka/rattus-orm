import {
  createAttrField,
  createBooleanField,
  createDateField,
  createNumberField,
  createStringField,
  createUidField,
} from '@rattus-orm/core/field-types'
import { createClasslessFieldConfigFunction } from './utils'

export const attrField = createClasslessFieldConfigFunction(createAttrField)
export const booleanField = createClasslessFieldConfigFunction(createBooleanField)
export const dateField = createClasslessFieldConfigFunction(createDateField)
export const numberField = createClasslessFieldConfigFunction(createNumberField)
export const stringField = createClasslessFieldConfigFunction(createStringField)
export const uidField = createClasslessFieldConfigFunction(createUidField)
