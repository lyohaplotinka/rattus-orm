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

Если ранее вы регистрировали кастомный репозиторий, вы можете передать его параметром
в дженерик: `useRepository<UserCustomRepository>(User)`. Все кастомные методы
и свойства также будут доступны с дестркутуризацией.

### Реактивность
В отличие от интеграций с Vue, полученные данные уже
реактивны. В примере выше вывод `user.email` будет
обновляться сразу.

Однако, важно помнить о контексте, в котором вы работаете.
Хук `useComputed` будет работать только тогда, когда 
обращение к базе данных происходит прямо внутри функции:

```tsx
const user = query().where('id', '1').first()

// Не сработает: нет обращения к сигналу внутри хука
const emailWithExplanation = useComputed(() => {
  return user.email + ' - is Email'
})
```

Чтобы всё работало как ожидается, вы можете делать так
(оба варианта сработают):
```tsx
const emailWithExplanation = useComputed(() => {
  return query().where('id', '1').first().email + ' - is Email'
})
```
```tsx
const user = useComputed(() => query().where('id', '1').first())

const emailWithExplanation = useComputed(() => {
  return user.value.email + ' - is Email'
})
```
