---
sidebar_position: 2
---

# Установка и использование

### Введение

Установить библиотеку можно с помощью вашего любимого пакетного менеджера: 
```bash
yarn add @rattus-orm/plugin-zod-validate
```

`@rattus-orm/plugin-zod-validate` использует [события базы данных](/docs/docs-core/events) 
для реализации проверки типа, поэтому его можно использовать с любым Data Provider. Чтобы 
включить валидацию, вызовите фабрику плагина в методе `use` базы данных:

```typescript
import { createDatabase } from '@rattus-orm/core'

const db = createDatabase({
  connection: 'entities',
  dataProvider: new ObjectDataProvider(),
  plugins: [RattusZodValidationPlugin()]
})

db.start()
```

### Нестрогий режим

По умолчанию валидатор работает в **нестрогом** режиме, то есть, при неудачной валидации данных
не будет выброшено исключение:

```typescript
class User extends Model {
  public static entity = 'user'

  @Num(0)
  public id: number

  @Str('')
  public name: string
}

db.getRepository(User).save({ id: 'asdasd', name: 'test' })
// Ошибки не будет, будет warning в консоль: 
// 
// Data validation failed (connection.user):
// 1. Invalid number: "asdasd" (user.id)
```

### Строгий режим
Если вы хотите получать ошибку при несоответствии данных, вы можете включить строгий
режим валидации: 
```typescript
db.use(RattusZodValidationPlugin({ strict: true }))
```
Либо, вы можете включить строгий режим для определённых моделей: 
```typescript
db.use(RattusZodValidationPlugin({ strict: [User.entity] }))
```
В этом случае, описанный выше warning станет текстом ошибки: 
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

Ошибка `RattusZodValidationError` содержит в себе оригинальные ошибки Zod, если по каким-то
причинам они вам нужны. Для TypeScript вы можете использовать специальный тайп-гард: 

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
