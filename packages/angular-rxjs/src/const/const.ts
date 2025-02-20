import { InjectionToken } from '@angular/core'
import type { RattusOrmInstallerOptions } from '@rattus-orm/core/utils/integrationsHelpers'

export const RATTUS_CONFIG = new InjectionToken<RattusOrmInstallerOptions>('RattusConfig')
