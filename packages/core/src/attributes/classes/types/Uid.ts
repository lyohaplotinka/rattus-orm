import { Type } from './Type'

export class Uid extends Type<string> {
  public readonly __isUid = true

  /**
   * Make the value for the attribute.
   */
  protected makeCasted(value: any): string {
    return value ?? crypto.randomUUID()
  }
}
