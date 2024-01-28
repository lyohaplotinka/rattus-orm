import ts from 'typescript'
import type { ConstructorDeclaration, MethodDeclaration, SourceFile, MethodSignature } from 'typescript'
import { MethodParam, ModuleJsonDocs, PublicMethod } from './types'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, parse } from 'node:path'
import { dirName } from '../../nodeUtils'
import apiDocsFiles from '../../apiDocsFiles.json'

const __dirname = dirName(import.meta.url)

const {
  createSourceFile,
  getJSDocCommentsAndTags,
  getJSDocParameterTags,
  getModifiers,
  isConstructorDeclaration,
  isMethodDeclaration,
  ScriptTarget,
  SyntaxKind,
  isMethodSignature,
} = ts

function visitNode(node: ts.Node, cb: (node: ts.Node) => void, declArray: PublicMethod[]) {
  cb(node)
  node.forEachChild((child) => visitNode(child, cb, declArray))
}

function getMethodName(node: MethodDeclaration | MethodSignature, sourceFile: SourceFile): string {
  return node.name.getText(sourceFile)
}

function getMethodDescription(node: MethodDeclaration | ConstructorDeclaration | MethodSignature): string {
  if (node.parameters.length) {
    const paramTags = getJSDocParameterTags(node.parameters[0])
    const parentComment = paramTags[0]?.parent?.comment
    return typeof parentComment === 'string' ? parentComment : 'COMPLEX'
  }

  const jsdoc = getJSDocCommentsAndTags(node).filter((node) => node.kind === SyntaxKind.JSDoc)[0]
  return jsdoc && typeof jsdoc.comment === 'string' ? jsdoc.comment : ''
}

function getMethodParams(
  node: MethodDeclaration | ConstructorDeclaration | MethodSignature,
  sourceFile: SourceFile,
): MethodParam[] {
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

function buildDocsForFile(fileStr: string, sectionName: string) {
  const sourceFile = createSourceFile(
    'x.ts',
    readFileSync(resolve(__dirname, '../../', fileStr), 'utf8'),
    ScriptTarget.Latest,
    true,
  )
  const moduleDocs: ModuleJsonDocs = {
    name: sectionName,
    publicMethods: [],
    publicProperties: [],
  }

  visitNode(
    sourceFile!,
    (node) => {
      if (
        isConstructorDeclaration(node) ||
        isMethodSignature(node) ||
        (isMethodDeclaration(node) && getModifiers(node)!.every((mod) => mod.kind === SyntaxKind.PublicKeyword))
      ) {
        const params = getMethodParams(node, sourceFile)
        if (params.some((v) => v.description === 'COMPLEX')) {
          return
        }

        moduleDocs.publicMethods.push({
          name: isConstructorDeclaration(node) ? 'constructor' : getMethodName(node, sourceFile),
          typeParams: node.typeParameters?.map((param) => param.getText(sourceFile)) ?? [],
          params: params,
          returnType: node.type ? node.type.getText(sourceFile) : '',
          description: getMethodDescription(node).replace(/\n/g, ' '),
        })
      }
    },
    moduleDocs.publicMethods,
  )

  const parsedPath = parse(fileStr)
  const newFileName = `${parsedPath.name}.api.json`
  writeFileSync(
    resolve(__dirname, '../../../', 'packages/docs/src/api-docs', newFileName),
    JSON.stringify(moduleDocs, null, 2) + '\n',
    'utf8',
  )
}

function main() {
  for (const [name, path] of Object.entries(apiDocsFiles)) {
    buildDocsForFile(path, name)
  }
}

main()
