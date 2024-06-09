---
sidebar_position: 3
---
# Database

### Overview

As mentioned earlier, the database is an object that connects all parts of the ORM together. It provides the link between the data provider, repositories, queries, and models.

For managing connections in models, normalization service is used (as Normalizr.js in Vuex ORM). Upon registering models, the database creates an entity schema based on the model configuration and prepares modules in the data provider.

### Creating a Database

Using the `createDatabase` function is the preferred method to create a database instance, however, if desired, you can manually create an instance of the class.

```typescript
import { createDatabase } from '@rattus-orm/core'

const database = createDatabase({
  dataProvider: new MyDataProvider(),
  connection: 'entities'
}).start()
```

As you can see, the data provider is first passed to the database, then a connection is specified. A connection is the name of the "root" module in your database. The returning instance will be linked with this module. The `start` method creates a root module for the connection.

Within a single data provider, you can create multiple "connections":

```typescript
import { createDatabase } from '@rattus-orm/core'

const myDataProvider = new MyDataProvider()

const db1 = createDatabase({ dataProvider: myDataProvider, connection: 'entities' }).start()
const db2 = createDatabase({ dataProvider: myDataProvider, connection: 'otherEntities' }).start()
```

### Registering Models

To interact with the data of a specific model, it must be registered in a particular database. This happens either when obtaining a repository or can be done manually:

```typescript
import { User } from '@/models'

const database = createDatabase({
  dataProvider: new MyDataProvider(),
  connection: 'entities'
}).start()

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

const database = createDatabase({
  dataProvider: new MyDataProvider(),
  connection: 'entities'
}).start()

const userRepo = database.getRepository(User)
const users = userRepo.all()
```

As a result, you get a **typed** repository for interacting with the User model's data.

:::info
The `getRepository` method is absent in Vuex ORM and Vuex ORM next.
:::
