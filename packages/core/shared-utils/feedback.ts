export class RattusOrmError extends Error {
  public name = 'RattusOrmError'

  constructor(message: string, tag = 'RattusOrm') {
    super(`[${tag}] ${message}`)
  }
}

export const rattusWarn = (message: string, tag = 'RattusOrm') => {
  console.warn(`[${tag}] ${message}`)
}
