---
sidebar_position: 3
---

# Manual Setup

### Creating database manually
Sometimes using a plugin may not be convenient. If this is your case, you can
set everything up manually.

First of all, you need to create a database [(more details here)](/docs/docs-core/database).
During the creation process, you need to pass the correctly configured Data provider to the database:

```typescript
import { Database } from '@rattus-orm/core'
import { SolidjsDataProvider } from '@rattus-orm/solidjs'

const database = new Database()
  .setDataProvider(new SolidjsDataProvider())
  .setConnection('entities')
  .start()
```

After that, you can use the database as usual: it is linked to the Solid
through the provider.

### Integration with Solid
The provider for Solid allows you to use the manually created database. For this, you need to pass it in props:

```tsx title="main.tsx"
render(() => (
    <RattusProvider database={database}>
      <App />
    </RattusProvider>
  ), root
)
```
