---
sidebar_position: 4
---

# Utilities

In the previous steps, we looked at the first utility: the `installRattusORM` function,
which provides a plugin for Vuex.

However, the package includes a number of other compositions.

:::warning
Compositions only work if you have used the plugin for installation.
They rely on the presence of the `$database` key in your store. If you want
to use them with manual setup, ensure your database is
placed in the Vuex store instance.
:::

### useRepository

The `useRepository` composition returns the main methods for interacting with the repository:
`'find', 'all', 'save', 'insert', 'fresh', 'destroy', 'flush'`. These can be used
with destructuring:

```html
<script lang="ts" setup>
    const { find, save } = useRepository(User)
    const user = computed(() => find('1'))

    const onUpdate = (age: number) => {
        save({ id: user.value.id, age })
    }
</script>
```

Remember that the retrieved method works only with data of the User model.
For working with other models, you can call the composition
again.

### useRepositoryComputed
This composition is very similar to the previous one, however,
all methods related to data retrieval –
`find` and `all` – are automatically wrapped in
Computed.
```html
<script lang="ts" setup>
    const { find, all } = useRepository(User)
    
    const user = find('1') // ComputedRef<User>
    the allUsers = all() // ComputedRef<User[]>
</script>
```
