---
sidebar_position: 3
---

# Manual Setup

Sometimes using a plugin may not be convenient. If this is your case, you can
set everything up manually.

First of all, you need to create a database [(more details here)](/docs/docs-core/database).
During the creation process, you need to pass the correctly configured Data Provider to the databaseю
Its constructor argument is an instance of your Vuex store:

```typescript
import { Database } from '@rattus-orm/core'
import { VuexDataProvider } from '@rattus-orm/vuex'
import { store } from './store'

const database = new Database()
  .setDataProvider(new VuexDataProvider(store))
  .setConnection('entities')
  .start()
```

After that, you can use the database as usual: it is linked to the store
through the provider.
