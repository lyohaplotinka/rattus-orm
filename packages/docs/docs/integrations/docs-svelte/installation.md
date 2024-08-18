---
sidebar_position: 2
---

# Installation and Usage

`@rattus-orm/svelte` is a separate package that does not include the core library. To start
using ORM in your Svelte application, you need to install everything:
```bash
yarn add @rattus-orm/core @rattus-orm/svelte
```

### Basic Usage Example
The simplest way to set up Rattus ORM with Svelte is to use the provider:

```html title="App.svelte"
<script>
  import { RattusProvider } from '@rattus-orm/svelte'
</script>

<RattusProvider>
  <!-- your components -->
</RattusProvider>
```
```typescript title="models/User.ts"
export class User extends Model {
    public static entity = 'user'
    
    @UidField()
    public id: string
    
    @StringField()
    public email: string
}
```
```html title="User.svelte"
<script>
  import { useRepository } from "@rattus-orm/svelte";
  import { User } from "./models/User";
  
  const userRepo = useRepository(User)
  const user = userRepo.find('1')

  setTimeout(() => {
    userRepo.save({ id: '1', email: 'test@test.com' })
  }, 1000)

</script>

<div>
  {#if $user}
    id: {$user.id}<br/>
    email: {$user.email}
  {/if}
</div>
```

### Using plugins

If you want to use [plugins](/docs/docs-core/plugins) with a database, you can
pass an array of plugins into the provider prop. For example, a [validation plugin with Zod](/docs/category/zod-validate):

```html
<script>
  import { RattusProvider } from '@rattus-orm/svelte'
  import { RattusZodValidationPlugin } from '@rattus-orm/plugin-zod-validate'
</script>

<RattusProvider plugins={[RattusZodValidationPlugin()]}>
  <!-- your components -->
</RattusProvider>
```
