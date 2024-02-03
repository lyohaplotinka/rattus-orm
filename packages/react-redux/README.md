<p align="center">
  <img style="margin-right: -15px" width="192px" src="https://raw.githubusercontent.com/lyohaplotinka/rattus-orm/main/assets/logo.svg" alt="Rattus ORM">
</p>

<p align="center">
  <img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/%40rattus-orm%2Freact-redux">
  <img alt="npm version (core)" src="https://img.shields.io/npm/v/%40rattus-orm%2Freact-redux">
</p>

<h1 align="center">Rattus ORM – React Redux</h1>

**React-redux data provider and helpers for Rattus ORM**

### Contents
1. ReactReduxDataProvider;
2. `<RattusProvier />` component;
3. Hooks: `useRattusContext`, `useRepository`.

### Installation
Use your favorite package manager. For example, yarn:
```bash
yarn add @rattus-orm/core @rattus-orm/react-redux @reduxjs/toolkit react-redux
```
### Basic usage
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

### Documentation
For detailed docs please read [documentation website](https://lyohaplotinka.github.io/rattus-orm/docs/category/redux-integration-react).

### Contributing
Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.
