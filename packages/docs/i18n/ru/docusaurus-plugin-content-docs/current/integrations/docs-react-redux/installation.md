---
sidebar_position: 2
---

# Установка и использование

`@rattus-orm/react-redux` – это отдельный пакет, не включающий в себя основную библиотеку. Чтобы начать
пользоваться ORM с Redux в вашем приложении React, нужно установить всё:
```bash
yarn add @rattus-orm/core @rattus-orm/react-redux @reduxjs/toolkit react-redux
```

### Создание хранилища Redux
Прежде чем использовать Rattus ORM, вам нужно создать хранилище Redux. Этот процесс подробно
описан в [документации](https://redux.js.org/introduction/getting-started). Вы можете использовать
любой удобный вам способ, включая Redux Toolkit, если он позволяет вам получить экземпляр ReduxState.

```typescript
import { configureStore } from "@reduxjs/toolkit";

// этот экземпляр будет нужен далее
export const store = configureStore({
  reducer: {
    // тут могут быть любые ваши Reducers. Rattus ORM не 
    // затронет ваши данные.
  },
})
```

### Базовый пример использования
Самый простой путь настроить Rattus ORM с Redux – использовать провайдер. `RattusProvider` включает 
в себя провайдер Redux, так что вам не нужно использовать оба:

```tsx title="main.tsx"
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RattusProvider } from "@rattus-orm/react-redux"
import App from './App.tsx'
import { store } from './store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RattusProvider store={store}>
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
import { useRepository } from "@rattus-orm/react-redux";
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
