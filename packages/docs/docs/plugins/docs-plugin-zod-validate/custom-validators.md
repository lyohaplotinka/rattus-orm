---

sidebar_position: 3

---

# Custom Validators

### Introduction
Automatically created Zod types for primitive fields may not always meet all your requirements. For example, for a field with the `Attr` attribute, a schema of type `z.unknown()` is created by default. This limits the possibilities for validating structures.

Additionally, there might be cases where you need to ensure that a string is longer than a certain number of characters, or a number is less than a specific maximum value.

For these situations, you can assign your own Zod schemas to any of the fields. This can be done in two ways, which will be discussed below.

:::warning[Important]
The schema you define does not **supplement** but **replaces** the automatically generated one. Keep this in mind when writing types.
:::

### Definition Through Static Property
For both JavaScript and TypeScript, you can define your own schemas for fields using a static property of your model's class, similar to how the `entity` property is defined:

```typescript
import { z } from 'zod'

export class User extends Model {
  public static entity = 'user'
  
  public static $zodSchemas = {
    age: z.number().gt(18)
  }
  
  @NumberField(0)
  public age: number
}
```

As a result, the `age` property will be validated using the schema you defined, while other fields will continue to work as before. The basic validation for Num will **not** work.

### Definition Through Decorators
The same can be achieved using the `ZodFieldType` decorator:

```typescript
import { z } from 'zod'
import { ZodFieldType } from '@rattus-orm/plugin-zod-validate'

export class User extends Model {
  public static entity = 'user'

  @ZodFieldType(z.number().gt(18))
  @NumberField(0)
  public age: number
}
```
