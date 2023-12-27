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

Хук useRepository возвращает основные методы для взаимодействия с репозиторием:
`'find', 'all', 'save', 'insert', 'fresh', 'destroy', 'flush', 'query`. Их можно использовать
с деструктуризацией:

```tsx
function App() {
  const { query, save } = useRepository(User)
  const user = query().where('id', '1').first()

  return (
    <>
      <p>{ user.email }</p>
      <button type="button" onClick={() => save({ id: '1', email: 'updated@test.com' })}>Update email</button>
    </>
  )
}
```

Не забудьте, что полученный метод работает только с данными модели User.
Для работы с другими моделями вы можете вызвать хук
ещё раз. 

### Реактивность
В отличие от интеграций с Vue, полученные данные уже
реактивны. В примере выше вывод `user.email` будет
обновляться сразу.

Однако, важно помнить о контексте, в котором вы работаете.
Если вы вызываете методы репозитория внутри функционального 
компонента - данные будут реактивны, изменеия будут вызывать
ререндер. 

При использовании за пределами компонента Data provider будет 
возвращать не реактивные данные. Под капотом используется
Redux хук `useSelector`, либо прямое обращение к состоянию. 
Способ получения данных определяется автоматически.
