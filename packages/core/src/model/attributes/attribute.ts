import type { ModelConstructor } from '@/model/types'

import type { Model } from '../Model'

export abstract class Attribute {
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
  public abstract make(value?: any): any
}
