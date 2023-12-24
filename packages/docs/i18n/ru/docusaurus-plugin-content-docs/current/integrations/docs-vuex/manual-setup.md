---
sidebar_position: 3
---

# Ручная настройка

### Создание базы данных вручную
Иногда использование плагина может быть неудобным. Если это ваш случай, всё 
можно настроить вручную. 

Прежде всего, нужно создать базу данных [(подробнее здесь)](/docs/docs-core/database).
В процессе создания нужно передать в базу данных правильно настроенный Data provider. 
Аргументом его конструктора является экземпляр вашего Vuex хранилища: 

```typescript
import { Database } from '@rattus-orm/core'
import { VuexDataProvider } from '@rattus-orm/vuex'
import { store } from './store'

const database = new Database()
  .setDataProvider(new VuexDataProvider(store))
  .setConnection('entities')
  .start()
```

После этого вы можете использовать базу данных как обычно: она связана с хранилищем
провайдером. 

### Интеграция с Vuex
Плагин для Vuex позволяет вам использовать созданную
вручную базу данных. Для этого вам нужно
передать её в параметры плагина:

```typescript
import { createStore } from 'vuex'
import { installRattusORM } from "@rattus-orm/vuex";
import { myDatabase } from './database'

const store = createStore({ 
  plugins: [installRattusORM({ database: myDatabase })]
})
```

После этого вы можете использовать все композиции
как обычно.
