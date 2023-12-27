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

The useRepository hook returns the main methods for interacting with the repository: `'find', 'all', 'save', 'insert', 'fresh', 'destroy', 'flush', 'query`. They can be used with destructuring:

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

Remember that the obtained method works only with the data of the User model. To work with other models, you can invoke the hook again.

### Reactivity
Unlike integrations with Vue, the obtained data are already reactive. In the example above, the output of `user.email` will update immediately.

However, it is important to remember the context in which you are working. If you call the repository methods inside a functional component, the data will be reactive, and changes will trigger re-renders.

When used outside of a component, the Data provider will return non-reactive data. Under the hood, it uses the Redux hook `useSelector`, or direct access to the state. The method of data retrieval is determined automatically.
