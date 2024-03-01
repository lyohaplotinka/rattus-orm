import type { TypeOptions } from '@rattus-orm/core'

import { createTypeBaseDecorator } from './typeBaseDecorator'

export function Str(value: string | null, options: TypeOptions = {}): any {
  return createTypeBaseDecorator(value, (context) => {
    const attr = context.$self().string(value)

    if (options.nullable) {
      attr.nullable()
    }

    return attr
  })
}
