---
sidebar_position: 3
---

# Ручная настройка

Иногда использование плагина может быть неудобным. Если это ваш случай, всё 
можно настроить вручную. 

Прежде всего, нужно создать базу данных [(подробнее здесь)](/docs/docs-core/database).
В процессе создания нужно передать в базу данных правильно настроенный Data provider. 
Аргументом его конструктора является экземпляр Pinia:

```typescript
import { Database } from '@rattus-orm/core'
import { PiniaDataProvider } from '@rattus-orm/pinia'
import { createPinia } from "pinia";

const pinia = createPinia()

const database = new Database()
  .setDataProvider(new PiniaDataProvider(pinia))
  .setConnection('entities')
  .start()
```

После этого вы можете использовать базу данных как обычно: она связана с хранилищем
провайдером. 
