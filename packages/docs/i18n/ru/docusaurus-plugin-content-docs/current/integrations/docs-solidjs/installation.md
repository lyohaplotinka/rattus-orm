---
sidebar_position: 2
---

# Установка и использование

`@rattus-orm/solidjs` – это отдельный пакет, не включающий в себя основную библиотеку. Чтобы начать
пользоваться ORM в вашем приложении Solid, нужно установить всё:
```bash
yarn add @rattus-orm/core @rattus-orm/solidjs
```

### Базовый пример использования
Самый простой путь настроить Rattus ORM с Solid – использовать провайдер:

```tsx title="main.ts"
import { render } from 'solid-js/web'

import './index.css'
import App from './App'
import { RattusProvider } from '@rattus-orm/solidjs'

const root = document.getElementById('root')

render(() => (
    <RattusProvider>
      <App />
    </RattusProvider>
  ), root
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
import { createComputed, onMount } from 'solid-js'
import { useRepository } from "@rattus-orm/solidjs";
import { User } from "./models/User.ts";

function App() {
  const { save, find } = useRepository(User)
  const user = find('1')

  onMount(() => {
    save({ id: '1', email: 'test' })
  })

  return (
    <div>
      <p>{ user()?.email }</p>
      <button type="button" onClick={() => save({ id: '1', email: 'updated@test.com' })}>Update email</button>
    </div>
  )
}
```

### Использование плагинов

Если вы хотите использовать [плагины](/docs/docs-core/plugins) с базой
данных, вы можете передать массив плагинов в пропс провайдера. К примеру, [плагин для валидации с Zod](/docs/category/zod-validate):
```tsx
render(() => (
    <RattusProvider plugins={[RattusZodValidationPlugin()]}>
      <App />
    </RattusProvider>
  ), root
)
```
