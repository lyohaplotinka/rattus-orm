<p align="center">
  <img style="margin-right: -15px" width="192px" src="https://raw.githubusercontent.com/lyohaplotinka/rattus-orm/main/assets/logo.svg" alt="Rattus ORM">
</p>

<p align="center">
  <img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/%40rattus-orm%2Freact-mobx">
  <img alt="npm version (core)" src="https://img.shields.io/npm/v/%40rattus-orm%2Freact-mobx">
</p>

<h1 align="center">Rattus ORM – React MobX</h1>

**React MobX data provider and helpers for Rattus ORM**

### Contents
1. ReactMobxDataProvider;
2. `<RattusProvier />` component;
3. Hooks: `useRattusContext`, `useRepository`.

### Installation
Use your favorite package manager. For example, yarn:
```bash
yarn add @rattus-orm/core @rattus-orm/react-mobx mobx mobx-react-lite
```
### Basic usage
```tsx title="main.tsx"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RattusProvider } from "@rattus-orm/react-mobx";

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
import { useRepository } from "@rattus-orm/react-mobx";
import { User } from "./models/User.ts";
import { observer } from 'mobx-react-lite'

const App = observer(() => {
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
      <p>{user.email}</p>
      <button type="button" onClick={() => save({ id: '1', email: 'updated@test.com' })}>Update email</button>
    </>
  )
})
```

### Documentation
For detailed docs please read [documentation website](https://lyohaplotinka.github.io/rattus-orm/docs/category/mobx-integration-react).

### Contributing
Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.
