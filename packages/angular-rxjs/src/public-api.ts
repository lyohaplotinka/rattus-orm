/*
 * Public API Surface of rattus-orm-angular-rxjs
 */
import { NgModule } from '@angular/core'

import { RattusOrmAngularRxjsService } from './lib/rattus-orm-angular-rxjs.service'

@NgModule({
  providers: [RattusOrmAngularRxjsService],
})
export class RattusOrmModule {}

export { RattusOrmAngularRxjsService }
