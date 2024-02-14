---
sidebar_position: 3
---

# Manual Setup

### Creating database manually
Sometimes you need to adjust database behavior or settings. If this is your case, you can
set everything up manually.

First of all, you need to create a database [(more details here)](/docs/docs-core/database). Angular
integration under the hood uses `ObjectDataProvider` and subscription to 
Database events, not any special state management related adapter. If you want
to use different provider, you can use it normally:

```typescript
import { Database } from '@rattus-orm/core'
import { ObjectDataProvider } from '@rattus-orm/core/object-data-provider'

const database = new Database()
  .setDataProvider(new ObjectDataProvider())
  // or
  // .setDataProvider(new MyCustomDataProvider())
  .setConnection('entities')
  .start()
```

Then, pass database to module parameters: 
```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RattusOrmModule } from "@rattus-orm/angular-rxjs";
import { myDatabase } from './myDatabase';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    importProvidersFrom(
      RattusOrmModule.forRoot({ 
        database: myDatabase,
      }),
    ),
  ],
};
```

After that, you can use `RattusContextService` as usual: your database is linked to it.
