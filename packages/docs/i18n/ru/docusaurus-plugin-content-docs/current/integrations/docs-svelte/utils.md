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

```html title="MyComponent.svelte"
<script>
  import { useRepository } from "@rattus-orm/svelte";
  import { User } from "./models/User";

  const { find, save } = useRepository(User)
  const user = userRepo.find('1')
</script>

<p>{ $user?.email }</p>
```

Не забудьте, что полученный метод работает только с данными модели User.
Для работы с другими моделями вы можете вызвать хук
ещё раз. 

`useRepository` возвращает [Readable Svelte store](https://svelte.dev/docs/svelte-store#readable) для методов `find`
и `all`. Для работы с Query хук возвращает два метода:
1. `query()` – возвращает обычный инстанс Query, результаты работы с ним не оборачиваются в `Readable`;
2. `withQuery((query: Query) => {...})` – оборачивает коллбэк в `Readable` и возвращает его.

Возвращённый Readable по факту является небольшой "надстройкой". 
У него есть геттер `value`, которые позволяет получать текущее 
состояние хранилища без вызова функции `get()` из `svelte/store`. 
Важно: возвращённое значение геттер не реактивно.

Если ранее вы регистрировали кастомный репозиторий, вы можете передать его параметром
в дженерик: `useRepository<UserCustomRepository>(User)`. Все кастомные методы
и свойства также будут доступны с дестркутуризацией, однако,
не будут автоматически обёрнуты в `Readable`.
