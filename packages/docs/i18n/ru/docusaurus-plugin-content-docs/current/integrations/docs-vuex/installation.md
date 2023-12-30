---
sidebar_position: 2
---

# Установка и использование

`@rattus-orm/vuex` – это отдельный пакет, не включающий в себя основную библиотеку. Чтобы начать
пользоваться ORM с Vuex в вашем приложении Vue, нужно установить всё:
```bash
yarn add @rattus-orm/core @rattus-orm/vuex vuex@next
```

### Базовый пример использования
Самый простой путь настроить Rattus ORM с Vuex – использовать встроенный vuex-плагин:

```typescript title="main.ts"
import { createApp } from 'vue'
import { createStore } from 'vuex'
import { installRattusORM } from "@rattus-orm/vuex";

const store = createStore({ 
  plugins: [installRattusORM()]
})


const app = createApp({ /* your root component */ })
app.use(store)
```

```html title="App.vue"
<template>
  <p>{{ user.email }}</p>
  <button type="button" @click="onClick">Update email</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Model, Uid, Str } from '@rattus-orm/core'
import { useRepositoryComputed } from '@rattus-orm/vuex'

class User extends Model {
public static entity = 'user'

@Uid()
public id: string

@Str()
public email: string
}

export default defineComponent({
  setup() {
    const { save, find } = useRepositoryComputed(User)
    
    save({ id: '1', email: 'test@test.com' })
    
    const onClick = () => {
      save({ id: '1', email: 'updated@test.com' })
    }
    
    const user = find('1')
    
    return {
      user,
      onClick,
    }
  }
})
</script>
``` 

### Использование плагинов

Если вы хотите использовать [плагины](/docs/docs-core/plugins) с базой 
данных, вы можете передать массив плагинов в объект конфигурации плагина. К примеру, [плагин для валидации с Zod](/docs/category/zod-validate):
```typescript
const store = createStore({ 
  plugins: [
    installRattusORM({
      plugins: [RattusZodValidationPlugin()]
    })
  ]
})
```
