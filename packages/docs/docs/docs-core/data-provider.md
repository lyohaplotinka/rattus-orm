---
sidebar_position: 2
---
# Data Provider

A Data Provider establishes the connection between a specific storage system and ORM. Generally, it is a class that implements the following interface:

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

In the terms of Rattus ORM (and Vuex ORM, which it is based on), a module is a "table" for a specific entity. For instance, when a User entity is introduced to the ORM, a new module - "User" is created.

The other methods have intuitively understandable names. If anything remains unclear, you can refer to the source code of [ObjectDataProvider](https://github.com/lyohaplotinka/rattus-orm/blob/main/packages/core/src/data/object-data-provider.ts).

:::info
Core package has utility class [DataProviderHelpers](https://github.com/lyohaplotinka/rattus-orm/blob/main/packages/core/src/data/data-provider-helpers.ts). If you are going to write your 
own provider, you may use it. 
:::

The Data Provider is linked to the database upon creation:

```typescript
const database = createDatabase({
  dataProvider: new ObjectDataProvider()
})
```
