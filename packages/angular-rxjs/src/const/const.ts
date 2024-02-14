import { InjectionToken } from '@angular/core'
import type { RattusOrmInstallerOptions } from '@rattus-orm/core'

export const RATTUS_CONFIG = new InjectionToken<RattusOrmInstallerOptions>('RattusConfig')
