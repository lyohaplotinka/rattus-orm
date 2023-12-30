---
sidebar_position: 2
---

# Installation and Usage

`@rattus-orm/react-redux` is a separate package that does not include the main library. To start using ORM with Redux in your React application, you need to install everything:
```bash
yarn add @rattus-orm/core @rattus-orm/react-redux @reduxjs/toolkit react-redux
```

### Creating a Redux Store
Before using Rattus ORM, you need to create a Redux store. This process is detailed in the [documentation](https://redux.js.org/introduction/getting-started). You can use any convenient method, including Redux Toolkit, as long as it allows you to obtain an instance of ReduxState.

```typescript
import { configureStore } from "@reduxjs/toolkit";

// this instance will be needed later
export const store = configureStore({
  reducer: {
    // here can be any of your Reducers. Rattus ORM will 
    // not affect your data.
  },
})
```

### Basic Usage Example
The simplest way to set up Rattus ORM with Redux is to use the provider. `RattusProvider` includes the Redux provider, so you don't need to use both:

```tsx title="main.tsx"
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RattusProvider } from "@rattus-orm/react-redux"
import App from './App.tsx'
import { store } from './store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RattusProvider store={store}>
      <App />
    </RattusProvider>
  </React.StrictMode>,
)
```

```typescript title="models/User.ts"
export class User extends Model {
    public static entity = 'user'
    
    @Uid()
    public id: string
    
    @Str()
    public email: string
}
```

```tsx title="App.tsx"
import { useEffect } from 'react'
import { useRepository } from "@rattus-orm/react-redux";
import { User } from "./models/User.ts";

function App() {
  const { query, save } = useRepository(User)
  const user = query().where('id', '1').first()

  useEffect(() => {
    save({ id: '1', email: 'test@test.com' })
  }, [])

  if (!user) {
    return ''
  }

  return (
    <>
      <p>{ user.email }</p>
      <button type="button" onClick={() => save({ id: '1', email: 'updated@test.com' })}>Update email</button>
    </>
  )
}
```

### Using plugins

If you want to use [plugins](/docs/docs-core/plugins) with a database, you can
pass an array of plugins into the provider prop. For example, a [validation plugin with Zod](/docs/category/zod-validate):
```tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RattusProvider store={store} plugins={[RattusZodValidationPlugin()]}>
      <App />
  </RattusProvider>
  </React.StrictMode>,
)
```
