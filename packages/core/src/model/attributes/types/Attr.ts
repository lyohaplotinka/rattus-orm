import { Type } from './Type'

export class Attr extends Type {
  /**
   * Make the value for the attribute.
   */
  public make(value: any): any {
    return value === undefined ? this.value : value
  }
}
