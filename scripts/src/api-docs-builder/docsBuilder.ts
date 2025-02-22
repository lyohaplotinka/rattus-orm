import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import type {
  ConstructorDeclaration,
  MethodDeclaration,
  MethodSignature,
  PropertyDeclaration,
  SourceFile,
} from 'typescript'
import ts from 'typescript'

import apiDocsFiles from '../../apiDocsFiles.json' assert { type: 'json' }
import { MONOREPO_ROOT_DIR } from '../utils/utils'
import type { MethodParam, ModuleJsonDocs, PublicMethod } from './types'

const apiDocsDir = resolve(MONOREPO_ROOT_DIR, 'packages/docs/src/api-docs')

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
  isPropertyDeclaration,
} = ts

function visitNode(node: ts.Node, cb: (node: ts.Node) => void, declArray: PublicMethod[]) {
  cb(node)
  node.forEachChild((child) => visitNode(child, cb, declArray))
}

function getMethodOrPropertyName(
  node: MethodDeclaration | MethodSignature | PropertyDeclaration,
  sourceFile: SourceFile,
): string {
  const name = node.name.getText(sourceFile)
  if (
    Array.isArray(node.modifiers) &&
    node.modifiers.some((mod) => mod.kind === SyntaxKind.StaticKeyword)
  ) {
    return `static ${name}`
  }
  return name
}

function getMethodOrPropertyDescription(
  node: MethodDeclaration | ConstructorDeclaration | MethodSignature | PropertyDeclaration,
): string {
  if (
    !isPropertyDeclaration(node) &&
    node.parameters.length &&
    node.parameters[0].name.getText() !== 'this'
  ) {
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
    readFileSync(resolve(MONOREPO_ROOT_DIR, fileStr), 'utf8'),
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
        (isMethodDeclaration(node) &&
          getModifiers(node)!.some((mod) => mod.kind === SyntaxKind.PublicKeyword))
      ) {
        const params = getMethodParams(node, sourceFile).filter((v) => v.name !== 'this')
        if (params.some((v) => v.description === 'COMPLEX')) {
          return
        }

        moduleDocs.publicMethods.push({
          name: isConstructorDeclaration(node)
            ? 'constructor'
            : getMethodOrPropertyName(node, sourceFile),
          typeParams: node.typeParameters?.map((param) => param.getText(sourceFile)) ?? [],
          params: params,
          returnType: node.type ? node.type.getText(sourceFile) : '',
          description: getMethodOrPropertyDescription(node).replace(/\n/g, ' '),
        })
      }

      if (
        isPropertyDeclaration(node) &&
        getModifiers(node)!.some((mod) => mod.kind === SyntaxKind.PublicKeyword)
      ) {
        moduleDocs.publicProperties.push({
          name: getMethodOrPropertyName(node, sourceFile),
          type: node.type ? node.type.getText(sourceFile) : '',
          initialValue: node.initializer ? node.initializer.getText(sourceFile) : '',
          description: getMethodOrPropertyDescription(node),
        })
      }
    },
    moduleDocs.publicMethods,
  )

  const newFileName = `${sectionName}.api.json`
  writeFileSync(
    resolve(apiDocsDir, newFileName),
    JSON.stringify(moduleDocs, null, 2) + '\n',
    'utf8',
  )
}

function main() {
  const exports: string[] = []

  for (const [name, path] of Object.entries(apiDocsFiles)) {
    buildDocsForFile(path, name)
    exports.push(`export { default as ${name}Api } from './${name}.api.json'`)
  }

  writeFileSync(resolve(apiDocsDir, 'index.ts'), exports.join('\n') + '\n', 'utf8')
}

main()
