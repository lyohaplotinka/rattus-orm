---
sidebar_position: 2
---

# Installation and Usage

`@rattus-orm/vuex` is a separate package that does not include the core library. To start
using ORM with Vuex in your Vue application, you need to install everything:
```bash
yarn add @rattus-orm/core @rattus-orm/vuex vuex@next
```

### Basic Usage Example
The simplest way to set up Rattus ORM with Vuex is to use the built-in Vuex plugin:

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
