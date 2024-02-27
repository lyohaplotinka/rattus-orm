export abstract class Attribute<MakeValue, ModelType> {
  /**
   * The model instance.
   */
  protected model: ModelType

  /**
   * Create a new Attribute instance.
   */
  constructor(model: ModelType) {
    this.model = model
  }

  /**
   * Make the value for the attribute.
   */
  public abstract make(value?: any): MakeValue
  protected abstract makeCasted(value?: any): MakeValue
  protected abstract makeRaw(value?: any): MakeValue
}
