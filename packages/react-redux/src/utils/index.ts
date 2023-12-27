import { RattusContext } from '@rattus-orm/core/rattus-context'
import { isUnknownRecord } from '@rattus-orm/utils/isUnknownRecord'
import React from 'react'

export const isInitializedContext = (value: unknown): value is RattusContext => {
  return value instanceof RattusContext
}

export const isCalledInComponent = () => {
  for (const key in React as Record<string, any>) {
    const value: any = React[key]
    if (isUnknownRecord(value) && isUnknownRecord(value.ReactCurrentOwner)) {
      return value.ReactCurrentOwner.current !== null
    }
  }
  return false
}
