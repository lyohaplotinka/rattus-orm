---
sidebar_position: 3
---

# Manual Setup

Sometimes using the plugin might be inconvenient. If this is your case, you can set everything up manually.

First of all, you need to create a database [(more details here)](/docs/docs-core/database). During the creation process, you need to pass a properly configured Data provider to the database. The argument for its constructor is an instance of Pinia:

```typescript
import { Database } from '@rattus-orm/core'
import { PiniaDataProvider } from '@rattus-orm/pinia'
import { createPinia } from "pinia";

const pinia = createPinia()

const database = new Database()
  .setDataProvider(new PiniaDataProvider(pinia))
  .setConnection('entities')
  .start()
```

After this, you can use the database as usual: it is connected to the storage provider.
