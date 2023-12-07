<p align="center">
  <img style="margin-right: -15px" width="192px" src="https://raw.githubusercontent.com/lyohaplotinka/rattus-orm/main/assets/logo.svg" alt="Rattus ORM">
</p>

<h1 align="center">Rattus ORM – Pinia</h1>

**Pinia data provider and helpers for Rattus ORM**

### Contents
1. PiniaDataProvider;
2. Composables: `useRattusContext`, `useRepository`, `useRepositoryComputed`.

### Installation
Use your favorite package manager. For example, yarn:
```bash
yarn add @rattus-orm/core @rattus-orm/pinia
```
### Basic usage
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
    
    the onClick = () => {
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
For detailed docs please read [documentation website](https://lyohaplotinka.github.io/rattus-orm/docs/category/pinia-integration-vue).

### Contributing
Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.
