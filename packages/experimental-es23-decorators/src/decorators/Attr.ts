import { createTypeBaseDecorator } from './typeBaseDecorator'

export function Attr(value?: any): any {
  return createTypeBaseDecorator(value, (context) => {
    return context.$self().attr(value)
  })
}
