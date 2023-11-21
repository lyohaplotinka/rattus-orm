<p align="center">
  <img style="margin-right: -15px" width="192px" src="https://raw.githubusercontent.com/lyohaplotinka/rattus-orm-new/main/assets/logo.svg" alt="Vuex ORM">
</p>

<h1 align="center">Rattus ORM – Core</h1>

### Contents
1. Base of Rattus ORM: Database, Repositories, Model, Query, all typings;
2. ObjectDataProvider – data provider for simple in-memory storage (JS Object).

### Installation
Use your favorite package manager. For example, yarn: 
```bash
npm i @rattus-orm/core
```
### Basic usage

```typescript
import { Database, Model, Uid, Str } from '@rattus-orm/core'
import { ObjectDataProvider } from '@rattus-orm/core/object-data-provider'

class User extends Model {
  public static entity = 'user'
  
  @Uid()
  public id: string
  
  @Str()
  public email: string
}

const database = new Database()
  .setDataProvider(new ObjectDataProvider())
  .setConnection('entities')
  .start()

const userRepo = database.getRepository(User)
userRepo.save([{ id: '1', email: 'test@test.com' }, { id: '2', email: 'test2@test.com' }])

const found = userRepo.find('2')
```

### Documentation
For detailed docs please read documentation website (coming soon)

### Contributing
Contributions are welcome! Please read our Contributing Guide for details on our code of conduct, and the process for submitting pull requests (coming soon).
