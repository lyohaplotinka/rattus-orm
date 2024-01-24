---
sidebar_position: 4
---

# Утилиты

В прошлых шагах мы рассмотрели первую утилиту: функцию `installRattusORM`, 
предоставляющую плагин для Vue. 

Однако, в пакет входит ещё ряд композиций. 

:::warning[Внимание]
Композиции работают только если вы пользовались установкой через плагин. 
Они опираются на наличие ключа `$rattusContext` в глобальных
свойствах экземпляра Vue, либо на provide-контекст, создаваемый
плагином.  
Если вы хотите их использовать при ручной настройке, вам необходимо
предоставить этот контекст. Подробнее смотрите [в коде](https://github.com/lyohaplotinka/rattus-orm/blob/main/packages/pinia/src/plugin/plugin.ts).
:::

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

```html
<script lang="ts" setup>
    const { find, save } = useRepository(User)
    const user = computed(() => find('1'))

    const onUpdate = (age: number) => {
        save({ id: user.value.id, age })
    }
</script>
```

Не забудьте, что полученный метод работает только с данными модели User.
Для работы с другими моделями вы можете вызвать композицию
ещё раз. 

`useRepository` автоматически возвращает `ComputedRef` из методов `find` 
и `all`. Для работы с Query композиция предоставляет два метода: 
1. `query()` – возвращает обычный экземпляр Query, все методы получения не оборачиваются в `ComputedRef`;
2. `withQuery((query: Query) => {...})` – оборачивает результат коллбэка в `ComputedRef`. 

Если ранее вы регистрировали кастомный репозиторий, мы можете передать его параметром
в дженерик: `useRepository<UserCustomRepository>(User)`. Все кастомные методы 
и свойства также будут доступны с дестркутуризацией, однако, в `ComputedRef` они
обёрнуты не будут.

