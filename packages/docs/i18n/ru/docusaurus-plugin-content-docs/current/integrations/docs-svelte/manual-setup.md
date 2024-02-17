---
sidebar_position: 3
---

# Ручная настройка
### Создание базы данных вручную
Иногда использование плагина может быть неудобным. Если это ваш случай, всё
можно настроить вручную. 

Прежде всего, нужно создать базу данных [(подробнее здесь)](/docs/docs-core/database).
В процессе создания нужно передать в базу данных правильно настроенный Data provider.
Интеграция для Svelte
под капотом использует `ObjectDataProvider` и подписку на события базы данных, а не какой-либо
специфичный data provider. Однако, если вы хотите использовать другой DataProvider, вы можете
делать это как обычно:

```typescript
import { Database } from '@rattus-orm/core'
import { ObjectDataProvider } from '@rattus-orm/core/object-data-provider'

const database = new Database()
  .setDataProvider(new ObjectDataProvider())
  // or
  // .setDataProvider(new MyCustomDataProvider())
  .setConnection('entities')
  .start()
```

После этого вы можете использовать базу данных как обычно: она связана с хранилищем
провайдером. 

### Интеграция с Svelte
Провайдер для Svelte позволяет вам использовать созданную
вручную базу данных. Для этого вам нужно
передать её в пропс:

```html title="App.svelte"
<RattusProvider database={database}>
  <App />
</RattusProvider>
```
