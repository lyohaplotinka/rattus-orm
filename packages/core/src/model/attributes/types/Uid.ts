import { Type } from './Type'

export class Uid extends Type<string> {
  /**
   * Make the value for the attribute.
   */
  protected makeCasted(value: any): string {
    return value ?? crypto.randomUUID()
  }
}
