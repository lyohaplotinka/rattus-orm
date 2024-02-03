<p align="center">
  <img style="margin-right: -15px" width="192px" src="https://raw.githubusercontent.com/lyohaplotinka/rattus-orm/main/assets/logo.svg" alt="Rattus ORM">
</p>

<p align="center">
  <img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/%40rattus-orm%2Fcore">
  <img alt="npm version (core)" src="https://img.shields.io/npm/v/%40rattus-orm%2Fcore">
</p>

<h1 align="center">Rattus ORM – Core</h1>

### Contents
1. Base of Rattus ORM: Database, Repositories, Model, Query, all typings;
2. ObjectDataProvider – data provider for simple in-memory storage (JS Object).

### Installation
Use your favorite package manager. For example, yarn: 
```bash
yarn add @rattus-orm/core
```

### Important notes
If you are using Vite with TypeScript, make sure you have these settings in `tsconfig.json`:
```json
{
  "compilerOptions": {
    // ...
    "useDefineForClassFields": true,
    "experimentalDecorators": true
  }
}
```

Also you should use this syntax for defining models:
```typescript
class User extends Model {
  public static entity = 'users'

  @Str('')
  // public id: string - will not work, 
  // all fields of your models will be "null"
  declare id: string
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
For detailed docs please read [documentation website](https://lyohaplotinka.github.io/rattus-orm/docs/category/core-package).

### Contributing
Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.
