---
sidebar_position: 4
---

# Утилиты

В прошлых шагах мы рассмотрели первую утилиту: функцию `rattusOrmPiniaVuePlugin`, 
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
export type RattusContext = {
  $database: Database
  $databases: Record<string, Database>
  $repo<M extends typeof Model>(model: M, connection?: string): Repository<InstanceType<M>>
}
```

### useRepository

Композиция useRepository возвращает основные методы для взаимодействия с репозиторием:
`'find', 'all', 'save', 'insert', 'fresh', 'destroy', 'flush'`. Их можно использовать
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

### useRepositoryComputed
Эта композиция очень похожа на предыдущую, однако, 
все методы, связанные с получением данных – 
`find` и `all` – автоматически оборачиваются в 
Computed. 
```html
<script lang="ts" setup>
    const { find, all } = useRepository(User)
    
    const user = find('1') // ComputedRef<User>
    const allUsers = all() // ComputedRef<User[]>
</script>
```
