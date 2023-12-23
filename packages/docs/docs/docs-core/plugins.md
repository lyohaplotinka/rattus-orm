---
sidebar_position: 8
---
# Plugins

Currently, a plugin is simply a way to "hide" operations performed on the database inside a function.

The type of plugin is very straightforward:
```typescript
export type DatabasePlugin = (db: Database) => void
```
As you can see, you get access to the database. For example, you can add [events](/docs/docs-core/events) and somehow process the incoming data.

In the future, there are plans to add the ability to customize the behavior of repositories and models. However, even now, you can change database methods using `Object.defineProperty`, or other means.
