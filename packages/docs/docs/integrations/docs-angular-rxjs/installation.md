---
sidebar_position: 2
---

# Installation and Usage

`@rattus-orm/angular-rxjs` is a separate package that does not include the core library. To start
using ORM in your Angular application, you also need to install core package:
```bash
yarn add @rattus-orm/core @rattus-orm/angular-rxjs
```

### Basic Usage Example
This package provides `RattusOrmModule` with `RattusContextService`. This
service is responsible for bootstrap and/or configuring database. 

All you need to do is to import this module. If you have a standalone application,
please consider adding module in your application config: 
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

If you have your root app's module, just use normal import:
```typescript title="app.module.ts"
import { RattusOrmModule } from "@rattus-orm/angular-rxjs";

@NgModule({
  imports: [RattusOrmModule.forRoot()],
})
export class AppModule {}
```

After that you can use `RattusContextService` in your application. It is
just a wrapper around `RattusContext` instance, which is used in other 
integrations, like React or Vue:

```typescript
import User from './models/User'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe],
  template: '<p>{{ (user | async)?.email }}</p>',
})
export class AppComponent {
  public user: Item<User>

  constructor(
    protected readonly contextService: RattusContextService,
  ) {
    const userRepo = contextService.getRepository(User)

    this.user = repo.query().where('id', '1').first()
  }
}
```

### Using plugins

If you want to use [plugins](/docs/docs-core/plugins) with a database, you can
pass an array of plugins into the module config. For example, a [validation plugin with Zod](/docs/category/zod-validate):

```tsx
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RattusOrmModule } from "@rattus-orm/angular-rxjs";
import { RattusZodValidationPlugin } from '@rattus-orm/plugin-zod-validate'

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    importProvidersFrom(
      RattusOrmModule.forRoot({ 
        plugins: [
          RattusZodValidationPlugin({ strict: true }),
        ],
      }),
    ),
  ],
};
```
