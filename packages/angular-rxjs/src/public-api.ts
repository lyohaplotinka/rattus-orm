/*
 * Public API Surface of rattus-orm-angular-rxjs
 */
import type { ModuleWithProviders } from '@angular/core'
import { NgModule } from '@angular/core'
import type { RattusOrmInstallerOptions } from '@rattus-orm/core/utils/integrationsHelpers'

import { RATTUS_CONFIG } from './const/const'
import { RattusContextService } from './context/rattus-context.service'

@NgModule()
export class RattusOrmModule {
  public static forRoot(config?: RattusOrmInstallerOptions): ModuleWithProviders<RattusOrmModule> {
    return {
      ngModule: RattusOrmModule,
      providers: [
        {
          provide: RATTUS_CONFIG,
          useValue: config ?? {},
        },
        RattusContextService,
      ],
    }
  }
}

export { RattusContextService }
