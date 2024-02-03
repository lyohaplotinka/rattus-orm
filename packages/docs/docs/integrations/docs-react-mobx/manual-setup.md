---
sidebar_position: 3
---

# Manual Setup
### Creating database manually
Sometimes using the plugin might be inconvenient. If this is your case, you can set everything up manually.

First of all, you need to create a database [(more details here)](/docs/docs-core/database).
During the creation process, you need to pass a correctly configured Data provider to the database:

```typescript
import { Database } from '@rattus-orm/core'
import { ReactMobxDataProvider } from '@rattus-orm/react-mobx'

const database = new Database()
  .setDataProvider(new ReactMobxDataProvider())
  .setConnection('entities')
  .start()
```

After this, you can use the database as usual: it's linked to the storage
by the provider.

### Integration with React
The provider for React allows you to use the
manually created database. To do this, you need
to pass it in the props:

```tsx title="main.tsx"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RattusProvider } from "@rattus-orm/react-mobx";
import { myDatabase } from './database'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RattusProvider database={ myDatabase }>
      <App />
    </RattusProvider>
  </React.StrictMode>,
)
```
