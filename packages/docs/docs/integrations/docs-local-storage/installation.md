---
sidebar_position: 2
---

# Installation and Usage

`@rattus-orm/local-storage` is a separate package that does not include the main library. To start
using ORM with LocalStorage in your application, you need to install everything:
```bash
yarn add @rattus-orm/core @rattus-orm/local-storage
```

### Basic Usage Example
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

### How It Works
Essentially, the provider stores all your changes in memory. Whenever any saving method is called, the data in memory is updated and then saved in localStorage.

Each time a module is created in every connection, the provider checks if there are any previously saved data in localStorage and, if so, loads them into memory. This approach allows for optimized data handling.

### Limitations
When working with localStorage, it's important to be aware of browser limitations, particularly regarding the maximum size of data that can be stored in localStorage.

:::warning
The Data Provider does not perform any checks. Before using, you need to ensure independently that the storage is accessible and not overloaded.
When writing a large amount of data, the Data Provider will notify you if you are close to the 5MB limit.
:::

