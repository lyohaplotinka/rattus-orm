---
sidebar_position: 3
---

# Ручная настройка
### Создание базы данных вручную
Иногда использование плагина может быть неудобным. Если это ваш случай, всё 
можно настроить вручную. 

Прежде всего, нужно создать базу данных [(подробнее здесь)](/docs/docs-core/database).
В процессе создания нужно передать в базу данных правильно настроенный Data provider. 
Аргументом его конструктора является экземпляр Pinia:

```typescript
import { createDatabase } from '@rattus-orm/core'
import { PiniaDataProvider } from '@rattus-orm/pinia'
import { createPinia } from "pinia";

const pinia = createPinia()

const database = createDatabase({
  connection: 'entities',
  dataProvider: new PiniaDataProvider(pinia)
}).start()
```

После этого вы можете использовать базу данных как обычно: она связана с хранилищем
провайдером. 

### Интеграция с Pinia
Плагин для Pinia позволяет вам использовать созданную
вручную базу данных. Для этого вам нужно
передать её в параметры плагина:

```typescript
import { createApp } from 'vue'
import { installRattusORM } from "@rattus-orm/pinia";
import { myDatabase } from './database'

const app = createApp({ /* your root component */ })
app
  .use(installRattusORM({ database: myDatabase }))
```

После этого вы можете использовать все композиции
как обычно.
