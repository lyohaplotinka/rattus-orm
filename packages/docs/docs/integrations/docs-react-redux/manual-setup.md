---
sidebar_position: 3
---

# Manual Setup
### Creating a Database Manually
Sometimes using a plugin might be inconvenient. If this is your case, everything can be set up manually.

First of all, you need to create a database [(more details here)](/docs/docs-core/database). Also, don't forget to create an instance of Redux store. During the creation process, you need to pass the correctly configured Data provider to the database:

```typescript
import { Database } from '@rattus-orm/core'
import { ReactReduxDataProvider } from '@rattus-orm/react-redux'
import { store } from './store'

const database = new Database()
  .setDataProvider(new ReactReduxDataProvider(store))
  .setConnection('entities')
  .start()
```

After this, you can use the database as usual: it is linked to the store through the provider.

### Integration with React
The provider for React allows you to use the manually created database. For this, you need to pass it in props:

```tsx title="main.tsx"
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RattusProvider } from "@rattus-orm/react-redux";
import App from './App.tsx'
import { myDatabase } from './database'
import { store } from './store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RattusProvider store={ store } database={ myDatabase }>
      <App />
    </RattusProvider>
  </React.StrictMode>,
)
```

### Custom Reducers
If you want to use other reducers alongside Rattus ORM, you can pass an object in the props of the component:
```tsx
<RattusProvider store={ store } sideReducers={{ counter: counterSlice.reducer }} />
```
