import type { Model } from '../../Model'
import { Attribute } from '../attribute'

export abstract class Type<MakeValue> extends Attribute<MakeValue, typeof Model> {
  /**
   * The default value for the attribute.
   */
  protected value: any

  /**
   * Whether the attribute accepts `null` value or not.
   */
  protected isNullable: boolean = false

  /**
   * Create a new Type attribute instance.
   */
  constructor(model: typeof Model, value: any = null) {
    super(model)
    this.value = value
  }

  public isTypeNullable() {
    return this.isNullable
  }

  /**
   * Set the nullable option to true.
   */
  public nullable(): this {
    this.isNullable = true

    return this
  }

  public make(value?: any): MakeValue {
    if (this.model.dataTypeCasting) {
      return this.makeCasted(value)
    }
    return this.makeRaw(value)
  }

  protected makeRaw(value?: any): MakeValue {
    return value ?? null
  }
}
