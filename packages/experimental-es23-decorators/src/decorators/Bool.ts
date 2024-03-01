import type { TypeOptions } from '@rattus-orm/core'

import { createTypeBaseDecorator } from './typeBaseDecorator'

export function Bool(value: boolean | null, options: TypeOptions = {}): any {
  return createTypeBaseDecorator(value, (context) => {
    const attr = context.$self().boolean(value)

    if (options.nullable) {
      attr.nullable()
    }

    return attr
  })
}
