<p align="center">
  <img style="margin-right: -15px" width="192px" src="https://raw.githubusercontent.com/lyohaplotinka/rattus-orm/main/assets/logo.svg" alt="Rattus ORM">
</p>

<p align="center">
  <img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/%40rattus-orm%2Fsvelte">
  <img alt="npm version (core)" src="https://img.shields.io/npm/v/%40rattus-orm%2Fsvelte">
</p>

<h1 align="center">Rattus ORM – Svelte</h1>

**Svelte bindings for Rattus ORM**

### Contents
1. `<RattusProvier />` component;
2. Hooks: `useRattusContext`, `useRepository`.

### Installation
Use your favorite package manager. For example, yarn:
```bash
yarn add @rattus-orm/core @rattus-orm/svelte
```
### Basic usage
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
    
    @Uid()
    public id: string
    
    @Str()
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

### Documentation
For detailed docs please read [documentation website](https://orm.rattus.dev/docs/category/svelte-integration).

### Contributing
Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.
