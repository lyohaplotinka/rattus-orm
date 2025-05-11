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
import { createDatabase } from '@rattus-orm/core'
import { ReactMobxDataProvider } from '@rattus-orm/react-mobx'

const database = createDatabase({
  connection: 'entities',
  dataProvider: new ReactMobxDataProvider()
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
import App from './App.tsx'
import './index.css'
import { RattusProvider } from "@rattus-orm/react-mobx";
import { myDatabase } from './database'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RattusProvider database={ myDatabase }>
      <App />
    </RattusProvider>
  </React.StrictMode>,
)
```
