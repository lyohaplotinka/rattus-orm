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
