import type { Model } from '../../model/Model'
import type { ModelConstructor } from '../../model/types'

export abstract class Attribute<MakeValue> {
  /**
   * The model instance.
   */
  protected model: Model

  /**
   * Create a new Attribute instance.
   */
  constructor(model: ModelConstructor<any>) {
    this.model = model
  }

  /**
   * Make the value for the attribute.
   */
  public make(value?: any): MakeValue {
    if (this.model.$self().dataTypeCasting) {
      return this.makeCasted(value)
    }
    return this.makeRaw(value)
  }

  protected abstract makeCasted(value?: any): MakeValue
  protected abstract makeRaw(value?: any): MakeValue
}
