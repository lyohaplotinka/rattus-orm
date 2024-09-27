import { Attribute } from '@/attributes/common/attribute'
import { attributeKindKey, typeKind } from '@/attributes/common/const'
import type { Model } from '@/model/Model'

export abstract class Type<MakeValue> extends Attribute<MakeValue> {
  public readonly [attributeKindKey] = typeKind

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

  protected makeRaw(value?: any): MakeValue {
    return value ?? null
  }
}
