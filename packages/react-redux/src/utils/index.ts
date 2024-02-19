import { isUnknownRecord } from '@rattus-orm/core/utils/isUnknownRecord'
import React from 'react'

export const isCalledInComponent = () => {
  for (const key in React as Record<string, any>) {
    const value: any = React[key]
    if (isUnknownRecord(value) && isUnknownRecord(value.ReactCurrentOwner)) {
      return value.ReactCurrentOwner.current !== null
    }
  }
  return false
}
