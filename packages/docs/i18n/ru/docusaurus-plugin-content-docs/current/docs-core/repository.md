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
import User from '@/models/User'

export class UserRepository extends Repository {
  public use = Post
  
  public myMethod() {
    // ...
  }
}
```
