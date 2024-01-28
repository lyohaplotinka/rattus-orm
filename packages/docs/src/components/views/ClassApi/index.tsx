import * as Apis from '@site/src/api-docs/index'
import CodeInline from '@theme/CodeInline'
import Heading from '@theme/Heading'

import type {
  ModuleJsonDocs,
  PublicMethod,
  PublicProperty,
} from '../../../../../../scripts/compilable/api-docs-builder/types'
import Styles from './styles.module.scss'

function isPublicMethod(value: unknown): value is PublicMethod {
  return typeof value === 'object' && value !== null && 'returnType' in value
}

function Property({ prop }: { prop: PublicProperty }) {
  const result = [prop.name]
  if (prop.type) {
    result.push(`: ${prop.type}`)
  }
  if (prop.initialValue) {
    result.push(` = ${prop.initialValue}`)
  }

  return (
    <div className={Styles.docBlock}>
      <CodeInline>
        {result.map((r) => {
          return r
        })}
      </CodeInline>{' '}
      - {prop.description}
    </div>
  )
}

function Method({ method }: { method: PublicMethod }) {
  const result: string[] = [method.name]
  if (method.typeParams.length) {
    result.push(`<${method.typeParams.join(', ')}>`)
  }
  result.push(`(${method.params.map((param) => param.declaration).join(', ')})`)
  if (method.returnType) {
    result.push(`: ${method.returnType}`)
  }

  return (
    <div className={Styles.docBlock}>
      <CodeInline>
        {result.map((r) => {
          return r
        })}
      </CodeInline>{' '}
      - {method.description}
      {method.params.length > 0 && (
        <ul>
          {method.params.map((param) => {
            return (
              <li>
                <CodeInline>{param.name}</CodeInline> - {param.description}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function PropertiesOrMethodsList({ data, heading }: { data: PublicProperty[] | PublicMethod[]; heading: string }) {
  return (
    <>
      <Heading as={'h4'}>{heading}</Heading>
      <ul>
        {data.map((item) => {
          return (
            <li key={item.name}>
              {isPublicMethod(item) && <Method method={item} />}
              {!isPublicMethod(item) && <Property prop={item} />}
            </li>
          )
        })}
      </ul>
    </>
  )
}

function OneClassApi({ name, docs }: { name: string; docs: ModuleJsonDocs }) {
  const hasProperties = docs.publicProperties.length > 0
  const hasMethods = docs.publicMethods.length > 0

  return (
    <section className={Styles.classSection}>
      <Heading as={'h2'} id={name}>
        {name}
      </Heading>
      {hasProperties && <PropertiesOrMethodsList data={docs.publicProperties} heading={'Properties'} />}
      {hasMethods && <PropertiesOrMethodsList data={docs.publicMethods} heading={'Methods'} />}
    </section>
  )
}

export default function ClassesApi() {
  return (
    <>
      {Object.values(Apis).map((doc) => {
        return <OneClassApi key={doc.name} name={doc.name} docs={doc} />
      })}
    </>
  )
}
