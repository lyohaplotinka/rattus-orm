---
sidebar_position: 3
---

# Manual Setup

### Creating database manually
Sometimes using a plugin may not be convenient. If this is your case, you can
set everything up manually.

First of all, you need to create a database [(more details here)](/docs/docs-core/database).
During the creation process, you need to pass the correctly configured Data Provider to the databaseю
Its constructor argument is an instance of your Vuex store:

```typescript
import { createDatabase } from '@rattus-orm/core'
import { VuexDataProvider } from '@rattus-orm/vuex'
import { store } from './store'

const database = createDatabase({
  connection: 'entities',
  dataProvider: new VuexDataProvider(store)
}).start()
```

After that, you can use the database as usual: it is linked to the store
through the provider.

### Integration with Vuex
The Vuex plugin allows you to use a manually created database. To do this, you need to pass it as a parameter to the plugin:

```typescript
import { createStore } from 'vuex'
import { installRattusORM } from "@rattus-orm/vuex";
import { myDatabase } from './database'

const store = createStore({ 
  plugins: [installRattusORM({ database: myDatabase })]
})
```

After that, you can use all compositions as usual.
