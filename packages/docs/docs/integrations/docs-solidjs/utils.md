---
sidebar_position: 4
---

# Utilities

The package includes a number of hooks that you can use in your work.

### useRattusContext
Returns a special object **RattusContext**, which provides access to managing databases and obtaining repositories.
```typescript
declare class RattusContext {
  $database: Database;
  $databases: Record<string, Database>;
  createDatabase(connection?: string, isPrimary?: boolean): Database;
  $repo<M extends typeof Model>(model: M, connection?: string): Repository<InstanceType<M>>;
}
```

### useRepository

The useRepository hook returns all methods of the
Repository class. These methods can be used with destructuring:

```tsx
function App() {
  const { find, save } = useRepository(User)
  const user = find('1')

  return (
    <>
      <p>{ user().email }</p>
      <button type="button" onClick={() => save({ id: '1', email: 'updated@test.com' })}>Update email</button>
    </>
  )
}
```

Remember that the obtained method only works with data of the `User`
model. To work with other models, you can call the composition again.

`useRepository` automatically returns an `Accessor` from the `find`
and `all` methods. For working with a Query, the composition provides
two methods:
1. `query()` – returns a regular instance of Query, and the retrieval methods are not wrapped in `Accessor`;
2. `withQuery((query: Query) => {...})` – wraps the result of the callback in `Accessor`.

If you have previously registered a custom repository, you can pass
it as a parameter in the generic: `useRepository<UserCustomRepository>(User)`.
All custom methods and properties will also be available for
destructuring, however, they will not be wrapped in `Accessor`.
