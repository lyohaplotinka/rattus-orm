import ts, {
  ConstructorDeclaration,
  createSourceFile,
  getJSDocCommentsAndTags,
  getJSDocParameterTags,
  getModifiers,
  isConstructorDeclaration,
  isMethodDeclaration,
  MethodDeclaration,
  ScriptTarget,
  SourceFile,
  SyntaxKind,
} from 'typescript'
import { MethodParam, PublicMethod } from './types'
import { readFileSync, writeFileSync } from 'node:fs'
import { program } from 'commander'
import { resolve, parse } from 'node:path'

function visitNode(node: ts.Node, cb: (node: ts.Node) => void, declArray: PublicMethod[]) {
  cb(node)
  node.forEachChild((child) => visitNode(child, cb, declArray))
}

function getMethodName(node: MethodDeclaration, sourceFile: SourceFile): string {
  return node.name.getText(sourceFile)
}

function getMethodDescription(node: MethodDeclaration | ConstructorDeclaration): string {
  if (node.parameters.length) {
    const paramTags = getJSDocParameterTags(node.parameters[0])
    const parentComment = paramTags[0]?.parent?.comment
    return typeof parentComment === 'string' ? parentComment : 'COMPLEX'
  }

  const jsdoc = getJSDocCommentsAndTags(node).filter((node) => node.kind === SyntaxKind.JSDoc)[0]
  return jsdoc && typeof jsdoc.comment === 'string' ? jsdoc.comment : ''
}

function getMethodParams(node: MethodDeclaration | ConstructorDeclaration, sourceFile: SourceFile): MethodParam[] {
  if (!node.parameters.length) {
    return []
  }

  return node.parameters.map<MethodParam>((param) => {
    const desc = getJSDocParameterTags(param)[0]?.comment

    return {
      declaration: param.getText(sourceFile),
      name: param.name.getText(sourceFile),
      description: typeof desc === 'string' ? desc : 'COMPLEX',
    }
  })
}

program
  .name('build-docs')
  .command('generate')
  .argument('filePath', 'file to create docs for')
  .action((fileStr: string) => {
    const sourceFile = createSourceFile('x.ts', readFileSync(fileStr, 'utf8'), ScriptTarget.Latest, true)

    const methodDeclarations: PublicMethod[] = []

    visitNode(
      sourceFile!,
      (node) => {
        if (
          isConstructorDeclaration(node) ||
          (isMethodDeclaration(node) && getModifiers(node)!.every((mod) => mod.kind === SyntaxKind.PublicKeyword))
        ) {
          const params = getMethodParams(node, sourceFile)
          if (params.some((v) => v.description === 'COMPLEX')) {
            return
          }

          methodDeclarations.push({
            name: isConstructorDeclaration(node) ? 'constructor' : getMethodName(node, sourceFile),
            typeParams: node.typeParameters?.map((param) => param.getText(sourceFile)) ?? [],
            params: params,
            returnType: node.type ? node.type.getText(sourceFile) : '',
            description: getMethodDescription(node).replace(/\n/g, ' '),
          })
        }
      },
      methodDeclarations,
    )

    const parsedPath = parse(fileStr)
    const newFileName = `${parsedPath.name}.api.json`
    writeFileSync(
      resolve(__dirname, '../../', 'packages/docs/src/api-docs', newFileName),
      JSON.stringify(methodDeclarations, null, 2) + '\n',
      'utf8',
    )
  })
  .parse()
