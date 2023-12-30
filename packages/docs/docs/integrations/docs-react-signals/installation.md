---
sidebar_position: 2
---

# Installation and Usage

`@rattus-orm/react-signals` is a separate package that does not include the main library. To start
using ORM with Signals in your React application, you need to install everything:
```bash
yarn add @rattus-orm/core @rattus-orm/react-signals @preact/signals-react
```

### Basic Usage Example
The simplest way to set up Rattus ORM with Signals is to use the provider:

```tsx title="main.tsx"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RattusProvider } from "@rattus-orm/react-signals";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RattusProvider>
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
import { useRepository } from "@rattus-orm/react-signals";
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
    <RattusProvider plugins={[RattusZodValidationPlugin()]}>
      <App />
  </RattusProvider>
  </React.StrictMode>,
)
```
