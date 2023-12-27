---
sidebar_position: 7
---
# Events

## Introduction

Rattus ORM provides a mechanism for subscribing to events that occur during data interactions. This offers you a more flexible way to customize behavior or integrate with libraries even without using a specific data provider.

You can subscribe to the following events:
```typescript
export const RattusEvents = {
  // New connection added
  CONNECTION_REGISTER: 'connection-register',
  // New module (model) registered
  MODULE_REGISTER: 'module-register',
  // Data saved using the Save method
  SAVE: 'save',
  // Data saved using the Insert method
  INSERT: 'insert',
  // Data replaced
  REPLACE: 'replace',
  // Data updated
  UPDATE: 'update',
  // Data deleted
  DELETE: 'delete',
  // All data removed from the table
  FLUSH: 'flush',
  // Module data changed, fires AFTER update
  DATA_CHANGED: 'data-changed',
} as const
```

## Subscribing to Events
To subscribe to events, you can use the `on` method in the database instance.
For convenience, the core package provides the `RattusEvents` enum. It is recommended to use it in case the events change or expand.

```typescript
import { type RattusEvents, Database } from '@rattus-orm/core'

const db = new Database()
// ...

db.on(RattusEvents.CONNECTION_REGISTER, (name) => {
  console.log(`Register connection ${name}`)
})
```

**Important:** the callback passed to the `on` method, in some cases, must return values, as the subscription allows you to manipulate the data.

### Events for Creating or Updating Data
If you subscribe to data creation or update events – `INSERT`, `SAVE`, `UPDATE`, `REPLACE` - the callback argument will be the data itself, passed to the Data provider, with the type `Elements`. You must return an object of this type, and it will be applied to the database.
```typescript
db.on(RattusEvents.INSERT, (data: Elements) => {
  data['1'].age = data['1'].age * 2
  return data
})
```

The `DATA_CHANGED` event, unlike those described above, is triggered after the data of a specific module has been updated, and does not allow changing the data. The callback's argument is an object with the module's path (connection and entity name), as well as the current state of the module:
```typescript
db.on(RattusEvents.DATA_CHANGED, (data) => {
  console.log(data.path) // ['entities', 'users']
  console.log(data.state) // { data: { '1': { id: '1', ... } }}
})
```

### Data Deletion Event
When subscribing to the `DELETE` event, the argument is an array of Primary keys of entities. You should also return an array of keys that will eventually be deleted.
```typescript
db.on(RattusEvents.DELETE, (ids: string[]) => {
  return ids.filter((id) => id !== 'do_not_delete')
})
```

### Module Registration Event
Subscribing to the `MODULE_REGISTER` event allows you to change both the module name and the initial data passed into it. The argument will be a special object of this type:
```typescript
type ModuleRegisterEventPayload = { 
  // module path tuple, in the format [<connection name>, <module name>]
  path: ModulePath; 
  // Module data, in the format { data: { <id>: { ... } } } 
  initialState?: State 
}
```
You should return such an object:
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

### Other Events
The `CONNECTION_REGISTER` and `FLUSH` events do not allow you to interact with the data, so the callback in their case may not return anything.

:::warning[Important]
Do not forget to return data from callbacks where necessary.
Failing to return data can lead to unexpected consequences,
up to the absence of data in the database.
:::

## Unsubscribing from Events
The database method `on` returns a function for unsubscribing from the event. You can unsubscribe from listening to events at any time.
```typescript
const unsubscribe = db.on(RattusEvents.DELETE, (ids: string[]) => {
  return ids.filter((id) => id !== 'do_not_delete')
})

setTimeout(() => {
  unsubscribe()
}, 10_000)
```

## Using Events
You can use events for a variety of purposes. Perhaps the most obvious are:
* Debugging and logging data changes
* Data validation
* Protecting certain data from deletion
* Replicating data to other storage systems.
