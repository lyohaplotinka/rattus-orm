---
sidebar_position: 2
---

# Установка и использование

`@rattus-orm/local-storage` это отдельный пакет, не включающий в себя основную библиотеку. Чтобы начать пользоваться ORM с localStorage в вашем приложении, нужно установить всё:
```bash
yarn add @rattus-orm/core @rattus-orm/local-storage
```

### Базовый пример использования
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

### Как это работает
Фактически, провайдер хранит все ваши изменения в памяти. При вызове любого 
сохраняющего метода данные в памяти обновляются, затем сохраняются в localStorage. 

При создании каждого модуля в каждом соединении провайдер проверяет, есть ли в 
localStorage сохранённые ранее данные, и если есть, загружает их в память. Такой
подход позволяет оптимизировать работу с данными.

### Ограничения
При работе с localStorage стоит помнить об ограничениях браузера, в частности, на
максимальный размер данных, который можно хранить в localStorage. 

:::warning[Внимание]
Data Provider не производит никаких проверок. Перед использованием вам нужно 
самостоятельно убедиться, что хранилище доступно и не переполнено.   
При записи большого объема данных Data Provider уведомит вас, вы близки к лимиту 
в 5mb. 
:::
