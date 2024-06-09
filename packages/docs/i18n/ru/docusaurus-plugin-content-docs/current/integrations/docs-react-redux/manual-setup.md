---
sidebar_position: 3
---

# Ручная настройка
### Создание базы данных вручную
Иногда использование плагина может быть неудобным. Если это ваш случай, всё
можно настроить вручную. 

Прежде всего, нужно создать базу данных [(подробнее здесь)](/docs/docs-core/database).
Также не забудьте создать экземпляр Redux store. 
В процессе создания нужно передать в базу данных правильно настроенный Data provider:

```typescript
import { createDatabase } from '@rattus-orm/core'
import { ReactReduxDataProvider } from '@rattus-orm/react-redux'
import { store } from './store'

const database = createDatabase({
  connection: 'entities',
  dataProvider: new ReactReduxDataProvider(store)
}).start()
```

После этого вы можете использовать базу данных как обычно: она связана с хранилищем
провайдером. 

### Интеграция с React
Провайдер для React позволяет вам использовать созданную
вручную базу данных. Для этого вам нужно
передать её в пропс:

```tsx title="main.tsx"
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RattusProvider } from "@rattus-orm/react-redux";
import App from './App.tsx'
import { myDatabase } from './database'
import { store } from './store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RattusProvider store={ store } database={ myDatabase }>
      <App />
    </RattusProvider>
  </React.StrictMode>,
)
```

### Собственные Reducers
Если вы хотите использовать другие reducers рядом с Rattus ORM, вы можете прокинуть объект в пропс 
компонента: 
```tsx
<RattusProvider store={ store } sideReducers={{ counter: counterSlice.reducer }} />
```
