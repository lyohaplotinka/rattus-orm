<p align="center">
  <img style="margin-right: -15px" width="192px" src="https://raw.githubusercontent.com/lyohaplotinka/rattus-orm/main/assets/logo.svg" alt="Rattus ORM">
</p>

<p align="center">
  <img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/%40rattus-orm%2Flocal-storage">
  <img alt="npm version (core)" src="https://img.shields.io/npm/v/%40rattus-orm%2Flocal-storage">
</p>

<h1 align="center">Rattus ORM – Local Storage</h1>

**localStorage data provider and helpers for Rattus ORM**

### Contents
1. LocalStorageDataProvider

### Installation
Use your favorite package manager. For example, yarn:
```bash
yarn add @rattus-orm/core @rattus-orm/local-storage
```
### Basic usage
```typescript
import { createDatabase, Model, Uid, Str } from '@rattus-orm/core'
import { LocalStorageDataProvider } from '@rattus-orm/local-storage'

class User extends Model {
  public static entity = 'user'
  
  @Uid()
  public id: string
  
  @Str()
  public email: string
}

const database = createDatabase({
  connection: 'entities',
  dataProvider: new LocalStorageDataProvider()
}).start()

const userRepo = database.getRepository(User)
userRepo.save([{ id: '1', email: 'test@test.com' }, { id: '2', email: 'test2@test.com' }])

const found = userRepo.find('2')
```

### Documentation
For detailed docs please read [documentation website](https://lyohaplotinka.github.io/rattus-orm/docs/category/localstorage-integration).

### Contributing
Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.
