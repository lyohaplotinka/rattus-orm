---
sidebar_position: 4
---

# Reactivity

By default, everything returned from a Repository or Query is not reactive. 
Angular and RxJS use Observable and BehaviorSubject to achieve reactivity. 
The key to getting reactive data is to call update on a specific instance 
of the above classes. Integration with Rattus ORM provides this feature 
automatically.

Every repository retrieved from RattusContextService or Database, even 
those you registered as custom, has an `observe` method added.
It takes one argument - a function, the only parameter of which is the 
instance of the same repository. In it you can access data in any way 
you want, including using Query. It returns a BehaviorSubject that is 
automatically subscribed to updates to the specific model's store.

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

You can subscribe to changes in code, or output model data in templates 
using AsyncPipe:
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

The resulting object is no different from a regular BehaviorSubject, 
except that it is automatically updated when the data in the store is updated.
