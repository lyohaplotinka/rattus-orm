import type { Model } from '../../Model'
import { Attribute } from '../attribute'

export abstract class Type extends Attribute {
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
  constructor(model: Model, value: any = null) {
    super(model)
    this.value = value
  }

  /**
   * Set the nullable option to true.
   */
  public nullable(): this {
    this.isNullable = true

    return this
  }
}
