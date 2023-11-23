---
sidebar_position: 4
---

# Утилиты

В прошлых шагах мы рассмотрели первую утилиту: функцию `installRattusORM`, 
предоставляющую плагин для Vuex. 

Однако, в пакет входит ещё ряд композиций. 

:::warning[Внимание]
Композиции работают только если вы использовались установкой через плагин. 
Они опираются на наличие ключа `$database` в вашем хранилище. Если вы хотите
их использовать при ручной настройке, позаботьсесь о размещении вашей базы 
данных в экземпляре Vuex-хранилища.
:::

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
