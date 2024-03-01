import { Model } from '@rattus-orm/core'

import { MODEL_CONSTRUCTOR_PARAMS_KEY } from './const'

const originalFill = Model.prototype.$fill
Model.prototype.$fill = function (this: Model, attributes, options) {
  if (!(MODEL_CONSTRUCTOR_PARAMS_KEY in this)) {
    Object.defineProperty(this, MODEL_CONSTRUCTOR_PARAMS_KEY, {
      value: { attributes, options },
      configurable: false,
      enumerable: false,
      writable: false,
    })
  }

  return originalFill.call(this, attributes, options)
}
