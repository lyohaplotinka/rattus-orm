import { createTypeBaseDecorator } from './typeBaseDecorator'

export function Uid(): any {
  return createTypeBaseDecorator(undefined, (context) => {
    return context.$self().uid()
  })
}
