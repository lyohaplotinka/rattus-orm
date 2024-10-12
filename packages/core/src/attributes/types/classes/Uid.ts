import { attributeKindKey, uidKind } from '@/attributes/common/const'

import { Type } from './Type'

export class Uid extends Type<string> {
  public readonly [attributeKindKey] = uidKind

  /**
   * Make the value for the attribute.
   */
  protected makeCasted(value: any): string {
    return value ?? crypto.randomUUID()
  }
}
