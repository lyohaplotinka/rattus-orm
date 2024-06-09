---
sidebar_position: 2
---
# Data provider

Data provider предоставляет связь конкретного хранилища с ORM. В общем случае, это класс, реализующий
следующий интерфейс:

```typescript
export interface DataProvider {
  registerConnection(name: string): void
  dump(): SerializedStorage
  restore(data: SerializedStorage): void
  registerModule(path: ModulePath, initialState?: State): void
  getModuleState(module: ModulePath): State
  hasModule(module: ModulePath): boolean
  save(module: ModulePath, records: Elements): void
  insert(module: ModulePath, records: Elements): void
  replace(module: ModulePath, records: Elements): void
  update(module: ModulePath, records: Elements): void
  delete(module: ModulePath, ids: string[]): void
  flush(module: ModulePath): void
}
```

В терминах Rattus ORM (и Vuex ORM, на котором он основан) модуль – это "таблица" для конкретной сущности. 
К примеру, когда в ORM попадает сущность User, создаётся новый модуль - "User". 

Остальные методы имеют интуитивно понятное название. Если что-либо остаётся неясно – посмотрите 
исходный код [ObjectDataProvider](https://github.com/lyohaplotinka/rattus-orm/blob/main/packages/core/src/data/object-data-provider.ts). 

:::info[Инфо]
В корневом пакете есть класс с утилитами: [DataProviderHelpers](https://github.com/lyohaplotinka/rattus-orm/blob/main/packages/core/src/data/data-provider-helpers.ts)  
Если вы собираетесь писать собственный Data provider, возможно, вам будет удобно его использовать.
:::

Data provider связывается с базой данных при создании:

```typescript
const database = createDatabase({
  dataProvider: new ObjectDataProvider()
})
```
