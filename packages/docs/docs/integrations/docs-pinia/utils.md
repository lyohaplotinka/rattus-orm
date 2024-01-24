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

The useRepository composition function returns all methods of the 
Repository class. These methods can be used with destructuring:

```html
<script lang="ts" setup>
    const { find, save } = useRepository(User)
    const user = computed(() => find('1'))

    const onUpdate = (age: number) => {
        save({ id: user.value.id, age })
    }
</script>
```
Remember that the obtained method only works with data of the `User` 
model. To work with other models, you can call the composition again.

`useRepository` automatically returns a `ComputedRef` from the `find` 
and `all` methods. For working with a Query, the composition provides 
two methods:
1. `query()` – returns a regular instance of Query, and the retrieval methods are not wrapped in `ComputedRef`;
2. `withQuery((query: Query) => {...})` – wraps the result of the callback in `ComputedRef`.

If you have previously registered a custom repository, you can pass 
it as a parameter in the generic: `useRepository<UserCustomRepository>(User)`. 
All custom methods and properties will also be available for 
destructuring, however, they will not be wrapped in `ComputedRef`.
