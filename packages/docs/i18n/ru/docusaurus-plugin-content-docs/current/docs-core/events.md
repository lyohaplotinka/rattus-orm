---
sidebar_position: 7
---
# События

## Введение

Rattus ORM предоставляет механизм подписки на события, происходящие при взаимодействии
с данными. Таким образом, вы получаете более гибкий способ кастомизации поведения, 
либо интеграции с библиотеками даже без использования специфичного data provider. 

Вы можете подписаться на следующие события: 
```typescript
export const RattusEvents = {
  // Добавлено новое соединение
  CONNECTION_REGISTER: 'connection-register',
  // Зарегистрирован новый модуль (модель)
  MODULE_REGISTER: 'module-register',
  // Данные сохранены методом Save
  SAVE: 'save',
  // Данные сохранены методом Insert
  INSERT: 'insert',
  // Данные заменены
  REPLACE: 'replace',
  // Данные обновлены
  UPDATE: 'update',
  // Данные удалены
  DELETE: 'delete',
  // Все данные удалены из таблицы
  FLUSH: 'flush',
  // Данные модуля обновились. Вызывается ПОСЛЕ обновления.
  DATA_CHANGED: 'data-changed',
} as const
```

## Подписка на события
Для подписки на события вы можете использовать метод `on` в экземпляре базы данных.
Для удобства, core-пакет предоставляет enum `RattusEvents`. Рекомендуем пользоваться
им, на случай, если события поменяются или расширятся.

```typescript
import { type RattusEvents, createDatabase } from '@rattus-orm/core'

const db = createDatabase()
// ...

db.on(RattusEvents.CONNECTION_REGISTER, (name) => {
  console.log(`Register connection ${name}`)
})
```

**Важно:** коллбэк, передаваемый в метод `on`, в некоторых случаях обязан возвращать 
значения, так как подписка позволяет вам манипулировать данными.

### События создания или обновления данных
Если вы подписываетесь на события создания или обновления данных – `INSERT`, `SAVE`, 
`UPDATE`, `REPLACE` - аргументом коллбэка будут сами данные, переданные в Data 
provider, с типом `Elements`. Вы должны обязательно вернуть объкет с этим типом, 
и именно он будет применен к базе.
```typescript
db.on(RattusEvents.INSERT, (data: Elements) => {
  data['1'].age = data['1'].age * 2
  return data
})
```

Событие `DATA_CHANGED`, в отличие от описанных выше, вызывается после обновления
данных конкретного модуля, и не позволяет поменять данные. Аргумент коллбэка - 
объект с путём модуля (connection и название сущности), а также актуальное
состояние модуля: 
```typescript
db.on(RattusEvents.DATA_CHANGED, (data) => {
  console.log(data.path) // ['entities', 'users']
  console.log(data.state) // { data: { '1': { id: '1', ... } }}
})
```

### Событие удаления данных
При подписке на событие `DELETE` аргумент – массив Primary key сущностей. Вам также 
стоит вернуть массив ключей, которые в итоге будут удалены.
```typescript
db.on(RattusEvents.DELETE, (ids: string[]) => {
  return ids.filter((id) => id !== 'do_not_delete')
})
```

### Событие регистрации модуля
Подписка на событие `MODULE_REGISTER` позволяет вам поменять как имя модуля, так и 
изначальные данные, которые в него передаются. Аргументом будет специальныый объект
такого типа:
```typescript
type ModuleRegisterEventPayload = { 
  // кортеж пути модуля, имеет вид [<имя соединения>, <имя модуля>]
  path: ModulePath; 
  // Данные модуля, имеют вид { data: { <id>: { ... } } } 
  initialState?: State 
}
```
Такой объект вам и стоит вернуть: 
```typescript
db.on(RattusEvents.MODULE_REGISTER, (data) => {
  const { path, initialState = { data: {} } } = data 
  
  if (path.at(-1) === 'preloaded') {
    initialState.data = { '1': { id: '1', data: 'I am here' } }
  }
  
  return {
    path,
    initialState
  }
})
```

### Остальные события
События `CONNECTION_REGISTER` и `FLUSH` не позволяют вам взаимодействовать
с данными, так что при их использовании коллбэк может ничего не возвращать. 

:::warning[Важно]
Не забывайте возвращать данные из коллбэков там, где это необходимо. 
Если забыть вернуть данные, вы можете столкнуться с неожиданными последствиями,
вплоть до отсутствия данных в базе. 
:::

## Отписка от событий
Метод базы данных `on` возвращает функцию отписки от события. Вы можете отписаться
от прослушивания событий в любой момент. 
```typescript
const unsubscribe = db.on(RattusEvents.DELETE, (ids: string[]) => {
  return ids.filter((id) => id !== 'do_not_delete')
})

setTimeout(() => {
  unsubscribe()
}, 10_000)
```

## Использование событий
Вы можете использовать события для самых разных целей. Пожалуй, самые очевидные:
* Дебаг и логгирование изменения данных
* Валидация данных
* Защита определенных данных от удаления
* Репликация данных в другие хранилища.
