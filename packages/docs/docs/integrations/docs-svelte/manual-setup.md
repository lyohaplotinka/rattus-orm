---
sidebar_position: 3
---

# Manual Setup

### Creating database manually
Sometimes using a plugin may not be convenient. If this is your case, you can
set everything up manually.

First of all, you need to create a database [(more details here)](/docs/docs-core/database).
During the creation process, you need to pass the correctly configured Data provider to the database.
Svelte integration under the hood uses `ObjectDataProvider` and subscription to
Database events, not any special state management related adapter. If you want
to use different provider, you can use it normally:

```typescript
import { Database } from '@rattus-orm/core'
import { ObjectDataProvider } from '@rattus-orm/core/object-data-provider'

const database = new Database()
  .setDataProvider(new ObjectDataProvider())
  // or
  // .setDataProvider(new MyCustomDataProvider())
  .setConnection('entities')
  .start()
```

After that, you can use the database as usual: it is linked to Svelte
through the provider.

### Integration with Svelte
The provider for Svelte allows you to use the manually created database. For this, you need to pass it in props:

```html title="App.svelte"
<RattusProvider database={database}>
  <App />
</RattusProvider>
```
