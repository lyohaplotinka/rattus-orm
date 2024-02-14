---
sidebar_position: 2
---

# Установка и использование

`@rattus-orm/angular-rxjs` – это отдельный пакет, не включающий в себя основную библиотеку. Чтобы использовать
ORM в вашем приложении Angular, нужно установить также и её:
```bash
yarn add @rattus-orm/core @rattus-orm/angular-rxjs
```

### Базовый пример использования
Этот пакет содержит `RattusOrmModule` с `RattusContextService`. Именно этот сервис отвечает
за создание и/или настройку базы данных. 

Всё, что вам нужно – импортировать этот модуль. Если у вас standalone-приложение, 
вы можете добавить модуль в конфигурацию приложения:
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

Если же у вас есть корневой модуль приложения, добавьте импорт туда:
```typescript title="app.module.ts"
import { RattusOrmModule } from "@rattus-orm/angular-rxjs";

@NgModule({
  imports: [RattusOrmModule.forRoot()],
})
export class AppModule {}
```

После этого вы можете использовать `RattusContextService` в приложении. 
Фактически, это обёртка над обычным `RattusContext`, который используется
в других интеграциях, например, в React или Vue:
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

### Использование плагинов

Если вы хотите использовать [плагины](/docs/docs-core/plugins) с базой
данных, вы можете передать массив плагинов в пропс провайдера. К примеру, [плагин для валидации с Zod](/docs/category/zod-validate):
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
