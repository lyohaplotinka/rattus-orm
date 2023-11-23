---
sidebar_position: 2
---
# Data provider

Data provider предоставляет связь конкретного хранилища с ORM. В общем случае, это класс, реализующий
следующий интерфейс:

```typescript
export interface DataProvider {
  registerModule(path: ModulePath, initialState?: State): void
  getState(module: ModulePath): State
  save(module: ModulePath, records: Elements): void
  insert(module: ModulePath, records: Elements): void
  fresh(module: ModulePath, records: Elements): void
  update(module: ModulePath, records: Elements): void
  destroy(module: ModulePath, ids: string[]): void
  delete(module: ModulePath, ids: string[]): void
  flush(module: ModulePath): void
}
```

В терминах Rattus ORM (и Vuex ORM, на котором он основан) модуль – это "таблица" для конкретной сущности. 
К примеру, когда в ORM попадает сущность User, создаётся новый модуль - "User". 

Остальные методы имеют интуитивно понятное название. Если что-либо остаётся неясно – посмотрите 
исходный код [ObjectDataProvider](https://github.com/lyohaplotinka/rattus-orm/blob/main/packages/core/src/data/object-data-provider.ts). 

Data provider связывается с базой данных при создании:

```typescript
const database = new Database()
  .setDataProvider(new ObjectDataProvider())
```
