<p align="center">
  <img style="margin-right: -15px" width="192px" src="https://raw.githubusercontent.com/lyohaplotinka/rattus-orm/main/assets/logo.svg" alt="Rattus ORM">
</p>

<p align="center">
  <img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/%40rattus-orm%2Fsolidjs">
  <img alt="npm version (core)" src="https://img.shields.io/npm/v/%40rattus-orm%2Fsolidjs">
</p>

<h1 align="center">Rattus ORM – Solid.js</h1>

**Solid.js data provider and helpers for Rattus ORM**

### Contents
1. SolidjsDataProvider;
2. `<RattusProvier />` component;
3. Hooks: `useRattusContext`, `useRepository`.

### Installation
Use your favorite package manager. For example, yarn:
```bash
yarn add @rattus-orm/core @rattus-orm/solidjs
```

### Basic usage
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
    
    @Uid()
    public id: string
    
    @Str()
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

### Documentation
For detailed docs please read [documentation website](https://lyohaplotinka.github.io/rattus-orm/docs/category/solid-integration).

### Contributing
Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.
