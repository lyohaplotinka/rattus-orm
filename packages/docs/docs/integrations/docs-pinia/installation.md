---
sidebar_position: 2
---

# Installation and Usage

`@rattus-orm/pinia` is a separate package that does not include the core library. To start using ORM with Pinia in your Vue application, you need to install everything:
```bash
yarn add @rattus-orm/core @rattus-orm/pinia pinia
```

### Basic Usage Example
The simplest way to set up Rattus ORM with Pinia is to use the built-in Vue plugin:

:::info[Important]
Unlike the integration with Vuex, this is a plugin for Vue, not for Pinia.
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
import { Model } from '@rattus-orm/core'
import { UidField, StringField } from '@rattus-orm/core/decorators'
import { useRepositoryComputed } from '@rattus-orm/pinia'

class User extends Model {
    public static entity = 'user'
    
    @UidField()
    public id: string
    
    @StringField()
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

You do not have to manually install the Pinia plugin in Vue. The following option will install the created instance automatically:
```typescript title="main.ts - passing Pinia to rattusOrmPiniaVuePlugin"
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { installRattusORM } from "@rattus-orm/pinia";

const pinia = createPinia()

const app = createApp({ /* your root component */ })
app
  // Pass the database name and Pinia instance.
  // Pinia will be automatically installed in Vue.
  .use(installRattusORM({
    connection: 'entities',
    pinia,
  }))
```

### Using plugins

If you want to use [plugins](/docs/docs-core/plugins) with a database, you can
pass an array of plugins into the plugin configuration
object. For example, a [validation plugin with Zod](/docs/category/zod-validate):
```typescript
app
  .use(pinia)
  .use(installRattusORM({
    plugins: [RattusZodValidationPlugin()]
  }))
```
