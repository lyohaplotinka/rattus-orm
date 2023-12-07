<p align="center">
  <img style="margin-right: -15px" width="192px" src="https://raw.githubusercontent.com/lyohaplotinka/rattus-orm/main/assets/logo.svg" alt="Rattus ORM">
</p>

<h1 align="center">Rattus ORM – React Signals</h1>

**React Signals data provider and helpers for Rattus ORM**

### Contents
1. ReactSignalsDataProvider;
2. `<RattusProvier />` component;
3. Hooks: `useRattusContext`, `useRepository`.

### Installation
Use your favorite package manager. For example, yarn:
```bash
yarn add @rattus-orm/core @rattus-orm/react-signals @preact/signals-react
```
### Basic usage
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

### Documentation
For detailed docs please read [documentation website](https://lyohaplotinka.github.io/rattus-orm/).

### Contributing
Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.
