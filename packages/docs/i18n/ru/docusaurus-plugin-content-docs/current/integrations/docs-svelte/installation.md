---
sidebar_position: 2
---

# Установка и использование

`@rattus-orm/svelte` – это отдельный пакет, не включающий в себя основную библиотеку. Чтобы начать
пользоваться ORM в вашем приложении Svelte, нужно установить всё:
```bash
yarn add @rattus-orm/core @rattus-orm/svelte
```

### Базовый пример использования
Самый простой путь настроить Rattus ORM с Svelte – использовать провайдер:

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

### Использование плагинов

Если вы хотите использовать [плагины](/docs/docs-core/plugins) с базой
данных, вы можете передать массив плагинов в пропс провайдера. К примеру, [плагин для валидации с Zod](/docs/category/zod-validate):
```html
<script>
  import { RattusProvider } from '@rattus-orm/svelte'
  import { RattusZodValidationPlugin } from '@rattus-orm/plugin-zod-validate'
</script>

<RattusProvider plugins={[RattusZodValidationPlugin()]}>
  <!-- your components -->
</RattusProvider>
```
