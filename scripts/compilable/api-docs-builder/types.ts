export type MethodParam = {
  declaration: string
  name: string
  description: string
}

export type PublicMethod = {
  name: string
  typeParams: string[]
  params: MethodParam[]
  returnType: string
  description: string
}

export type PublicProperty = {
  name: string
  type: string
  initialValue: string
  description: string
}

export type ModuleJsonDocs = {
  name: string
  publicMethods: PublicMethod[]
  publicProperties: PublicProperty[]
}
