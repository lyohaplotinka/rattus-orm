<p align="center">
  <img style="margin-right: -15px" width="192px" src="https://raw.githubusercontent.com/lyohaplotinka/rattus-orm/main/assets/logo.svg" alt="Rattus ORM">
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
import { Database, Model, Uid, Str } from '@rattus-orm/core'
import { LocalStorageDataProvider } from '@rattus-orm/local-storage'

class User extends Model {
  public static entity = 'user'
  
  @Uid()
  public id: string
  
  @Str()
  public email: string
}

const database = new Database()
  .setDataProvider(new LocalStorageDataProvider())
  .setConnection('entities')
  .start()

const userRepo = database.getRepository(User)
userRepo.save([{ id: '1', email: 'test@test.com' }, { id: '2', email: 'test2@test.com' }])

const found = userRepo.find('2')
```

### Documentation
For detailed docs please read [documentation website](https://lyohaplotinka.github.io/rattus-orm/docs/category/vuex-integration).

### Contributing
Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.
