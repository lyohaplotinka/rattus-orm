---
sidebar_position: 4
---

# Utilities

In the previous steps, we discussed the first utility: the `installRattusORM` function, which provides a plugin for Vue.

However, the package includes a number of other compositions.

:::warning[Attention]
Compositions only work if you used the plugin for installation. They rely on the presence of the `$rattusContext` key in the global properties of the Vue instance, or on the provide-context created by the plugin. If you want to use them with manual setup, you need to provide this context. For more details, see [the code](https://github.com/lyohaplotinka/rattus-orm/blob/main/packages/pinia/src/plugin/plugin.ts).
:::

### useRattusContext
Returns a special **RattusContext** object, which provides access to database management and repository retrieval.
```typescript
declare class RattusContext {
  $database: Database;
  $databases: Record<string, Database>;
  createDatabase(connection?: string, isPrimary?: boolean): Database;
  $repo<M extends typeof Model>(model: M, connection?: string): Repository<InstanceType<M>>;
}
```

### useRepository

The useRepository composition returns the main methods for interacting with a repository: `'find', 'all', 'save', 'insert', 'fresh', 'destroy', 'flush'`. They can be used with destructuring:

```html
<script lang="ts" setup>
    const { find, save } = useRepository(User)
    const user = computed(() => find('1'))

    const onUpdate = (age: number) => {
        save({ id: user.value.id, age })
    }
</script>
```

Remember that the retrieved method works only with User model data. To work with other models, you can call the composition again.

### useRepositoryComputed
This composition is very similar to the previous one, however, all methods related to data retrieval – `find` and `all` – are automatically wrapped in Computed.
```html
<script lang="ts" setup>
    const { find, all } = useRepository(User)
    
    const user = find('1') // ComputedRef<User>
    const allUsers = all() // ComputedRef<User[]>
</script>
```
