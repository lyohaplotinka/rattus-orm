import { Type } from './Type'

export class Attr extends Type<any> {
  /**
   * Make the value for the attribute.
   */
  protected makeCasted(value: any): any {
    return value === undefined ? this.value : value
  }
}
