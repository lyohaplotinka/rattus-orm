import type { Model } from '../Model'

export abstract class Attribute {
  /**
   * The model instance.
   */
  protected model: Model

  /**
   * Create a new Attribute instance.
   */
  constructor(model: Model) {
    this.model = model
  }

  /**
   * Make the value for the attribute.
   */
  public abstract make(value?: any): any
}
