---
sidebar_position: 3
---

# Ручная настройка

### Создание базы данных вручную
Иногда бывает нужно изменить поведение или настройки базы данных. В таких случаях вы можете
создать базу вручную.

Прежде всего, нужно создать базу данных [(подробнее здесь)](/docs/docs-core/database). Интеграция для Angular
под капотом использует `ObjectDataProvider` и подписку на события базы данных, а не какой-либо
специфичный data provider. Однако, если вы хотите использовать другой DataProvider, вы можете
делать это как обычно:
```typescript
import { Database } from '@rattus-orm/core'
import { ObjectDataProvider } from '@rattus-orm/core/object-data-provider'

const database = new Database()
  .setDataProvider(new ObjectDataProvider())
  // или
  // .setDataProvider(new MyCustomDataProvider())
  .setConnection('entities')
  .start()
```

Затем, передайте базу данных в параметры модуля:
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

После этого вы можете использовать `RattusContextService` как обычно: ваша база данных связана с ним.
