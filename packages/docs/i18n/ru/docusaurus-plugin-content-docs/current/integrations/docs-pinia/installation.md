---
sidebar_position: 2
---

# Установка и использование

`@rattus-orm/pinia` – это отдельный пакет, не включающий в себя основную библиотеку. Чтобы начать
пользоваться ORM с Pinia в вашем приложении Vue, нужно установить всё:
```bash
yarn add @rattus-orm/core @rattus-orm/pinia pinia
```

### Базовый пример использования
Самый простой путь настроить Rattus ORM с Pinia – использовать встроенный Vue-плагин:

:::info[Важно]
В отличие от интеграции с Vuex, это плагин именно для Vue, а не для Pinia. 
:::

```typescript title="main.ts"
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { installRattusORM } from "@rattus-orm/pinia";

const pinia = createPinia()

const app = createApp({ /* your root component */ })
app
  .use(pinia)
  .use(installRattusORM())
```

```html title="App.vue"
<template>
  <p>{{ user.email }}</p>
  <button type="button" @click="onClick">Update email</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Model, Uid, Str } from '@rattus-orm/core'
import { useRepositoryComputed } from '@rattus-orm/pinia'

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

Вам необязательно самостоятельно устанавливать плагин
Pinia во Vue. Следующий вариант установит созданный 
экземпляр автоматически:
```typescript title="main.ts - передача Pinia в rattusOrmPiniaVuePlugin"
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { installRattusORM } from "@rattus-orm/pinia";

const pinia = createPinia()

const app = createApp({ /* your root component */ })
app
  // Передайте название базы данных и инстанс Pinia.
  // Pinia будет автоматически установлена во Vue.
  .use(installRattusORM({
    connection: 'entities',
    pinia,
  }))
```
