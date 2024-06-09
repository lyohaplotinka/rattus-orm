---
sidebar_position: 6
---
# Репозиторий

### Основное

:::info[Инфо]
Эта часть документации написана по следам `vuex-orm-next`.
Однако, Rattus ORM более ориентирован на работу с
TypeScript и декораторами.
:::

Как и Vuex ORM, Rattus ORM поддерживает шаблон «Data 
Mapper» для взаимодействия с хранилищем. Шаблон 
Data Mapper — одна из традиционных реализаций ORM. 
Используя подход Data Mapper, вы определяете все 
методы запроса в отдельных классах, называемых 
«репозиториями», и извлекаете, вставляете, 
обновляете и удаляете объекты, используя репозитории.

В Data Mapper ваши модели не умеют почти ничего — они просто 
определяют свои свойства и могут иметь некоторые 
«фиктивные» методы. Проще говоря, Data Mapper — это подход к доступу к вашей базе данных в 
репозиториях, а не в моделях.

### Получение репозитория для модели

Для получения репозитория используется метод объекта 
Database: 

```typescript
const userRepo = db.getRepository(User)
userRepo.save(...)
```

В базовой реализации репозитория есть множество методов,
который подойдут для работы с данными. С ними можно 
ознакомиться в документации Vuex ORM Next: 

:::info[Инфо]
Помните, что документация по ссылкам ниже завязана на 
Vuex. Заменяйте `store.$repo` на результат выполнения
метода `getRepository` объекта `Database`.
:::

1. [Получение данных](https://next.vuex-orm.org/guide/repository/retrieving-data.html)
2. [Вставка данных](https://next.vuex-orm.org/guide/repository/inserting-data.html)
3. [Обновление данныех](https://next.vuex-orm.org/guide/repository/updating-data.html)
4. [Удаление данных](https://next.vuex-orm.org/guide/repository/deleting-data.html)

### Кастомизация репозитория

Если вы хотите добавить в репозиторий свои методы, вы 
можете наследовать класс от базовой реализации. 
Связать его с моделью можно с помощью свойства `use`:

```typescript
import { Repository } from '@rattus-orm/core'
import Post from '@/models/Post'

export class PostRepository extends Repository<Post> {
  public use = Post
  
  public myMethod() {
    // ...
  }
}
```

У вас есть два варианта использования кастомного репозитория. Первый - создать его экземпляр напрямую, передав в конструктор базу данных, а затем вызвать метод `initialize`:
```typescript
const postRepository = new PostRepository(database).initialize()
postRepository.myMethod()
```

Второй - зарегистрировать репозиторий в базе данных, чтобы автоматически получать нужный класс при вызове метода `getRepository`:
```typescript
const db = createDatabase({
  dataProvider: new MyDataProvider(),
  connection: 'entities',
  customRepositories: [PostRepository]
}).start()

// or dynamically
database.registerCustomRepository(PostRepository)

const postRepository = db.getRepository<PostRepository>(Post)
postRepository.myMethod()
```
Это также будет работать и с контекстом (в интеграциях):
```typescript
const postRepository = useRattusContext().$repo<PostRepository>(Post)
postRepository.myMethod()
```

:::info[Важно (для TypeScript)]
Метод `getRepository` в базе данных и `$repo` в контексте по умолчанию возвращают
тип `Repository<ваша_модель>`. Не забудьте передать тип вашего репозитория
в аргумент дженерика соответствующего метода.
:::
