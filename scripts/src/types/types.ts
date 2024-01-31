export type PackageMeta = {
  title: string
  matchPattern: string
  path?: string
  exportName?: string
  runFunctional?: boolean
  runLocal?: boolean
  autoBump?: boolean
  order?: number
}
