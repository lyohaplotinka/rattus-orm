---
sidebar_position: 3
---
# База данных

### Основное

Как говорилось ранее, база данных – объект, который 
связывает все части ORM между собой. Она предоставляет
связь data provider с репозиториями, queries и моделями.

Для обеспечения связей в моделях используется сервис нормализации
(как это сделано с помощью Normalizr.js и в Vuex ORM). База данных,
при регистрации моделей, создаёт схему сущностей на основе
конфигурации модели и подготавливает модули в data provider. 

### Создание базы данных

Использование функции `createDatabase` - предпочтительный способ создать инстанс базы данных, однако, при желании, вы можете создавать экземпляр класса вручную.

```typescript
import { createDatabase } from '@rattus-orm/core'

const database = createDatabase({
  dataProvider: new MyDataProvider(),
  connection: 'entities'
}).start()
```

Как видите, сперва в базу данных передается data provider, 
а затем указывается соединение. Соединение - это имя 
"корневого" модуля в вашей базе данных. Вернувшийся 
экземпляр будет связан именно с этим модулем. 
Метод `start` создаёт корневой модуль для подключения.

В рамках одного data provider вы можете создавать несколько
"подключений":

```typescript
import { createDatabase } from '@rattus-orm/core'

const myDataProvider = new MyDataProvider()

const db1 = createDatabase({ dataProvider: myDataProvider, connection: 'entities' }).start()
const db2 = createDatabase({ dataProvider: myDataProvider, connection: 'otherEntities' }).start()
```

### Регистрация моделей

Чтобы взаимодействовать с данными определенной модели, 
она должна быть зарегистрирована в конкретной базе 
данных. Это происходит либо в момент получения репозитория,
либо это можно сделать вручную: 

```typescript
import { User } from '@/models'

const database = createDatabase({
  dataProvider: new MyDataProvider(),
  connection: 'entities'
}).start()

database.register(User)
```

:::tip[Подсказка]
Если ваша модель содержит в себе связи с другими моделями – 
их не нужно регистрировать отдельно. Это произойдёт автоматически.
:::

### Получение репозитория
Взаимодействие с данными реализовано через **Репозитории** – 
специальные сервисы, имеющие нужные методы для управления данными.

:::tip[Подсказка]
При получении репозитория происходит автоматическая регистрация
модели.
:::

Получить экземпляр такого сервиса можно из базы данных: 

```typescript
import { User } from '@/models'

const database = createDatabase({
  dataProvider: new MyDataProvider(),
  connection: 'entities'
}).start()

const userRepo = database.getRepository(User)
const users = userRepo.all()
```

В результате вы получите **типизированный** репозиторий 
для взаимодействия с данными модели User.

:::info[Инфо]
Метод `getRepository` отсутствует в Vuex ORM и Vuex ORM next.
:::
