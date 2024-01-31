export type Commit = {
  message: string
  hash: string
  affectedFiles: string[]
}

export type ChangelogElement = {
  packageKey: string
  packageName: string
  packageVersion: string
  commitMessages: string[]
}
