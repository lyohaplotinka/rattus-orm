---

sidebar_position: 2

---

# Installation and Usage

### Introduction

You can install the library using your favorite package manager:
```bash
yarn add @rattus-orm/plugin-zod-validate
```

`@rattus-orm/plugin-zod-validate` uses [database events](/docs/docs-core/events) for type checking implementation, so it can be used with any Data Provider. To enable validation, invoke the plugin factory in the `use` method of your database:

```typescript
import { createDatabase } from '@rattus-orm/core'

const db = createDatabase({
  connection: 'entities',
  dataProvider: new ObjectDataProvider(),
  plugins: [RattusZodValidationPlugin()]
})

db.start()
```

### Non-Strict Mode

By default, the validator operates in **non-strict** mode, meaning no exception will be thrown in case of failed data validation:

```typescript
class User extends Model {
  public static entity = 'user'

  @Num(0)
  public id: number

  @Str('')
  public name: string
}

db.getRepository(User).save({ id: 'asdasd', name: 'test' })
// No error will occur, only a warning in the console: 
// 
// Data validation failed (connection.user):
// 1. Invalid number: "asdasd" (user.id)
```

### Strict Mode
If you prefer to receive an error when data doesn't match the criteria, you can enable strict validation mode:
```typescript
db.use(RattusZodValidationPlugin({ strict: true }))
```
Or, you can activate strict mode for specific models:
```typescript
db.use(RattusZodValidationPlugin({ strict: [User.entity] }))
```
In this case, the above warning will turn into an error message:
```typescript
class User extends Model {
  public static entity = 'user'

  @Num(0)
  public id: number

  @Str('')
  public name: string
}

db.getRepository(User).save({ id: 'asdasd', name: 'test' })
// RattusZodValidationError: Data validation failed (connection.user):
// 1. Invalid number: "asdasd" (user.id)
```

The `RattusZodValidationError` contains the original Zod errors, in case they are needed. For TypeScript, you can use a special type guard:

```typescript
import { isRattusZodValidationError } from '@rattus-orm/plugin-zod-validate'

try {
  db.getRepository(User).save({ id: 'asdasd', name: 'test' })
} catch (e) {
  if (isRattusZodValidationError(e)) {
    console.log(e.originalZodErrors) // ZodError[]
  }
}
```
