---
sidebar_position: 3
---
# Database

### Overview

As mentioned earlier, the database is an object that connects all parts of the ORM together. It provides the link between the data provider, repositories, queries, and models.

For managing connections in models, Normalizr.js is used (as in Vuex ORM). Upon registering models, the database creates an entity schema based on the model configuration and prepares modules in the data provider.

### Creating a Database

To create a database, you can do the following:

```typescript
const database = new Database()
  .setDataProvider(new MyDataProvider())
  .setConnection('entities')
  .start()
```

As you can see, the data provider is first passed to the database, then a connection is specified. A connection is the name of the "root" module in your database. The returning instance will be linked with this module. The `start` method creates a root module for the connection.

Within a single data provider, you can create multiple "connections":

```typescript
const myDataProvider = new MyDataProvider()

const db1 = new Database()
  .setDataProvider(myDataProvider)
  .setConnection('entities')
  .start()

const db2 = new Database()
  .setDataProvider(myDataProvider)
  .setConnection('otherEntities')
  .start()
```

### Registering Models

To interact with the data of a specific model, it must be registered in a particular database. This happens either when obtaining a repository or can be done manually:

```typescript
import { User } from '@/models'

const database = new Database()
  .setDataProvider(new MyDataProvider())
  .setConnection('entities')
  .start()

database.register(User)
```

:::tip
If your model contains relationships with other models, they do not need to be registered separately. This will happen automatically.
:::

### Obtaining a Repository
Interactions with data are implemented through **Repositories** – special services with necessary methods for data management.

:::tip
Automatic model registration occurs when obtaining a repository.
:::

You can get a service instance from the database:

```typescript
import { User } from '@/models'

const database = new Database()
  .setDataProvider(new MyDataProvider())
  .setConnection('entities')
  .start()

const userRepo = database.getRepository(User)
const users = userRepo.all()
```

As a result, you get a **typed** repository for interacting with the User model's data.

:::info
The `getRepository` method is absent in Vuex ORM and Vuex ORM next.
:::
