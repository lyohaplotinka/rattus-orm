---
sidebar_position: 3
---

# Manual Setup
### Creating database manually

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

### Integration with Pinia
The Pinia plugin allows you to use a manually created database. To do this, you need to pass it as a parameter to the plugin:

```typescript
import { createApp } from 'vue'
import { installRattusORM } from "@rattus-orm/pinia";
import { myDatabase } from './database'

const app = createApp({ /* your root component */ })
app
  .use(installRattusORM({ database: myDatabase }))
```

After that, you can use all compositions as usual.
