---
sidebar_position: 4
---

# Реактивность

По умолчанию всё, что возращается из Repository или Query не реактивно. 
В Angular и RxJS для достижения реактивности используются Observable и BehaviorSubject. 
Ключевой момент в получении реактивных данных - вызов обновления в конкретном 
инстансе вышеупомянутых классов. Интеграция с Rattus ORM предоставляет такую 
возможность автоматически.

В каждом репозитории, полученном из RattusContextService или Database, даже в 
тех, которые вы зарегистрировали в качестве кастомных, добавлен метод `observe`. 
Он принимает в себя один аргумент - функцию, единственный параметр которой - 
инстанс этого же репозитория. В ней вы можете как угодно обращаться к данным, 
в том числе с помощью Query. Она возвращает BehaviorSubject, автоматически 
подписанный на обновления хранилища конкретной модели.
```typescript
public user: BehaviorSubject<Item<User>>

constructor(
  protected readonly contextService: RattusContextService,
) {
  const userRepo = contextService.getRepository(User)

  this.user = userRepo.observe(
    (repo) => repo.query()
      .where('id', '1')
      .first()
  )
}
```

Вы можете подписываться на изменения в коде, или выводить данные модели в 
шаблонах при помощи AsyncPipe:
```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe],
  template: '<p>{{ (user | async)?.email }}</p>',
})
export class AppComponent { 
  // ...
}
```

Полученный объект ничем не отличается от обычного BehaviorSubject, кроме 
того, что он автоматически обновляется при обновлении данных в хранилище.
