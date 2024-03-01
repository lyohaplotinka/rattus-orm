import type { TypeOptions } from '@rattus-orm/core'

import { createTypeBaseDecorator } from './typeBaseDecorator'

export function Num(value: number | null, options: TypeOptions = {}): any {
  return createTypeBaseDecorator(value, (context) => {
    const attr = context.$self().number(value)

    if (options.nullable) {
      attr.nullable()
    }

    return attr
  })
}
