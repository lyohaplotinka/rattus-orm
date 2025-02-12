export class RattusOrmError extends Error {
  public name = 'RattusOrmError'

  constructor(message: string, tagParam = 'RattusOrm') {
    const tag = tagParam === 'RattusOrm' ? '[RattusOrm]' : `[RattusOrm][${tagParam}]`
    super(`${tag} ${message}`)
  }
}

export const rattusWarn = (message: string, tag = 'RattusOrm') => {
  console.warn(`[${tag}] ${message}`)
}
