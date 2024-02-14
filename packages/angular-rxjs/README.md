<p align="center">
  <img style="margin-right: -15px" width="192px" src="https://raw.githubusercontent.com/lyohaplotinka/rattus-orm/main/assets/logo.svg" alt="Rattus ORM">
</p>

<p align="center">
  <img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/%40rattus-orm%2Fangular-rxjs">
  <img alt="npm version (core)" src="https://img.shields.io/npm/v/%40rattus-orm%2Fangular-rxjs">
</p>

<h1 align="center">Rattus ORM – Angular RxJS</h1>

**Angular + RxJS bindings for Rattus ORM**

### Contents
1. RattusOrmModule - module for Angular.

### Installation
Use your favorite package manager. For example, yarn:
```bash
yarn add @rattus-orm/core @rattus-orm/angular-rxjs
```
### Basic usage
```typescript title="app.config.ts"
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RattusOrmModule } from "@rattus-orm/angular-rxjs";

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    importProvidersFrom(RattusOrmModule.forRoot())
  ],
};
```

```typescript title="models/User.ts"
export class User extends Model {
    public static entity = 'user'
    
    @Uid()
    public id: string
    
    @Str()
    public email: string
}
```

```typescript title="app.component.ts"
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe],
  template: '<p>{{ (user | async)?.email }}</p>',
})
export class AppComponent {
  public user: BehaviorSubject<Item<User>>

  constructor(
    protected readonly contextService: RattusContextService,
  ) {
    const userRepo = contextService.getRepository(User)

    this.user = userRepo.observe((repo) => repo.query().where('id', '1').first())
  }
}
```

### Documentation
For detailed docs please read [documentation website](https://orm.rattus.dev/docs/category/angular-rxjs-integration).

### Contributing
Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.
