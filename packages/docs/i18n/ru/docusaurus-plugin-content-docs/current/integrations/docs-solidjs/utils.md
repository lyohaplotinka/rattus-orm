---
sidebar_position: 4
---

# Утилиты

В пакет входит ряд хуков, которые вы можете использовать
в работе.

### useRattusContext
Возвращает специальный объект **RattusContext**, дающий доступ
к управлению базами данных и получению репозиториев.
```typescript
declare class RattusContext {
  $database: Database;
  $databases: Record<string, Database>;
  createDatabase(connection?: string, isPrimary?: boolean): Database;
  $repo<M extends typeof Model>(model: M, connection?: string): Repository<InstanceType<M>>;
}
```

### useRepository

Композиция useRepository возвращает все методы класса Repository. Их можно использовать
с деструктуризацией:

```tsx
function App() {
  const { find, save } = useRepository(User)
  const user = find('1')

  return (
    <>
      <p>{ user().email }</p>
      <button type="button" onClick={() => save({ id: '1', email: 'updated@test.com' })}>Update email</button>
    </>
  )
}
```

Не забудьте, что полученный метод работает только с данными модели User.
Для работы с другими моделями вы можете вызвать хук
ещё раз. 

`useRepository` возвращает функцию `Accessor` для методов `find`
и `all`. Для работы с Query хук возвращает два метода:
1. `query()` – возвращает обычный инстанс Query, результаты работы с ним не оборачиваются в `Accessor`;
2. `withQuery((query: Query) => {...})` – оборачивает коллбэк в `Accessor` и возвращает его.

Если ранее вы регистрировали кастомный репозиторий, вы можете передать его параметром
в дженерик: `useRepository<UserCustomRepository>(User)`. Все кастомные методы
и свойства также будут доступны с дестркутуризацией, однако, 
не будут автоматически обёрнуты в `Accessor`.
