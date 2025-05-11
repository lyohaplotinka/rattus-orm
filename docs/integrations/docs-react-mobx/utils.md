---
sidebar_position: 4
---

# Utilities

The package includes a number of hooks that you can use
in your work.

### useRattusContext
Returns a special object **RattusContext**, which provides access
to database management and repository retrieval.
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

```tsx
function App() {
  const { query, save } = useRepository(User)
  const user = query().where('id', '1').first()

  return (
    <>
      <p>{ user.email }</p>
      <button type="button" onClick={() => save({ id: '1', email: 'updated@test.com' })}>Update email</button>
    </>
  )
}
```

Remember that the obtained method works only with the data of the User model.
To work with other models, you can call the hook
again.

If you have previously registered a custom repository, you can pass
it as a parameter in the generic: `useRepository<UserCustomRepository>(User)`.
All custom methods and properties will also be available for
destructuring.

### Reactivity
Unlike integrations with Vue, the obtained data is already
reactive. In the example above, the output of `user.email` will
be updated immediately.

Don't forget to wrap your component in `observer` from `mobx-react` or 
`mobx-react-lite`.
