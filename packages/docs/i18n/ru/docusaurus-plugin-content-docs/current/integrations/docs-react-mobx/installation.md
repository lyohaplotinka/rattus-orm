---
sidebar_position: 2
---

# Установка и использование

`@rattus-orm/react-mobx` – это отдельный пакет, не включающий в себя основную библиотеку. Чтобы начать
пользоваться ORM с MobX в вашем приложении React, нужно установить всё:
```bash
yarn add @rattus-orm/core @rattus-orm/react-mobx mobx mobx-react-lite
```

### Базовый пример использования
Самый простой путь настроить Rattus ORM с MobX – использовать провайдер:

```tsx title="main.tsx"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RattusProvider } from "@rattus-orm/react-mobx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RattusProvider>
      <App />
    </RattusProvider>
  </React.StrictMode>,
)
```

```typescript title="models/User.ts"
export class User extends Model {
    public static entity = 'user'
    
    @Uid()
    public id: string
    
    @Str()
    public email: string
}
```

```tsx title="App.tsx"
import { useEffect } from 'react'
import { useRepository } from "@rattus-orm/react-mobx";
import { User } from "./models/User.ts";

function App() {
  const { query, save } = useRepository(User)
  const user = query().where('id', '1').first()

  useEffect(() => {
    save({ id: '1', email: 'test@test.com' })
  }, [])

  if (!user) {
    return ''
  }

  return (
    <>
      <p>{ user.email }</p>
      <button type="button" onClick={() => save({ id: '1', email: 'updated@test.com' })}>Update email</button>
    </>
  )
}
```

### Использование плагинов

Если вы хотите использовать [плагины](/docs/docs-core/plugins) с базой
данных, вы можете передать массив плагинов в пропс провайдера. К примеру, [плагин для валидации с Zod](/docs/category/zod-validate):
```tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RattusProvider plugins={[RattusZodValidationPlugin()]}>
      <App />
  </RattusProvider>
  </React.StrictMode>,
)
```
