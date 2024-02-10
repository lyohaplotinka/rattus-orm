---
sidebar_position: 3
---

# Ручная настройка
### Создание базы данных вручную
Иногда использование плагина может быть неудобным. Если это ваш случай, всё
можно настроить вручную. 

Прежде всего, нужно создать базу данных [(подробнее здесь)](/docs/docs-core/database). 
В процессе создания нужно передать в базу данных правильно настроенный Data provider:

```typescript
import { Database } from '@rattus-orm/core'
import { SolidjsDataProvider } from '@rattus-orm/solidjs'

const database = new Database()
  .setDataProvider(new SolidjsDataProvider())
  .setConnection('entities')
  .start()
```

После этого вы можете использовать базу данных как обычно: она связана с Solid
провайдером. 

### Интеграция с Solid
Провайдер для Solid позволяет вам использовать созданную
вручную базу данных. Для этого вам нужно
передать её в пропс:

```tsx title="main.tsx"
render(() => (
    <RattusProvider database={database}>
      <App />
    </RattusProvider>
  ), root
)
```
