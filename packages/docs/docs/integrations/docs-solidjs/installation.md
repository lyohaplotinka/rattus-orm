---
sidebar_position: 2
---

# Installation and Usage

`@rattus-orm/solidjs` is a separate package that does not include the core library. To start
using ORM in your Solid.js application, you need to install everything:
```bash
yarn add @rattus-orm/core @rattus-orm/solidjs
```

### Basic Usage Example
The simplest way to set up Rattus ORM with Solid is to use the provider:

```tsx title="main.ts"
import { render } from 'solid-js/web'

import './index.css'
import App from './App'
import { RattusProvider } from '@rattus-orm/solidjs'

const root = document.getElementById('root')

render(() => (
    <RattusProvider>
      <App />
    </RattusProvider>
  ), root
)
```
```typescript title="models/User.ts"
export class User extends Model {
    public static entity = 'user'
    
    @UidField()
    public id: string
    
    @StringField()
    public email: string
}
```
```tsx title="App.tsx"
import { createComputed, onMount } from 'solid-js'
import { useRepository } from "@rattus-orm/solidjs";
import { User } from "./models/User.ts";

function App() {
  const { save, find } = useRepository(User)
  const user = find('1')

  onMount(() => {
    save({ id: '1', email: 'test' })
  })

  return (
    <div>
      <p>{ user()?.email }</p>
      <button type="button" onClick={() => save({ id: '1', email: 'updated@test.com' })}>Update email</button>
    </div>
  )
}
```

### Using plugins

If you want to use [plugins](/docs/docs-core/plugins) with a database, you can
pass an array of plugins into the provider prop. For example, a [validation plugin with Zod](/docs/category/zod-validate):
```tsx
render(() => (
    <RattusProvider plugins={[RattusZodValidationPlugin()]}>
      <App />
    </RattusProvider>
  ), root
)
```
