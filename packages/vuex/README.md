<p align="center">
  <img style="margin-right: -15px" width="192px" src="https://raw.githubusercontent.com/lyohaplotinka/rattus-orm/main/assets/logo.svg" alt="Rattus ORM">
</p>

<h1 align="center">Rattus ORM – Vuex</h1>

**Vuex data provider and helpers for Rattus ORM**

### Contents
1. VuexDataProvider;
2. Composables: `useRepository`, `useRepositoryComputed`.

### Installation
Use your favorite package manager. For example, yarn:
```bash
yarn add @rattus-orm/core @rattus-orm/vuex
```
### Basic usage

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

```vue title="App.vue"
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

### Documentation
For detailed docs please read [documentation website](https://lyohaplotinka.github.io/rattus-orm/docs/category/vuex-integration).

### Contributing
Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.
