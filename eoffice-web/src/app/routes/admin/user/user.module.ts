import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { CreateUserComponent } from './create-user/create-user.component';
import { ListUserComponent } from './list-user/list-user.component';
import { SharedModule } from '@shared';

const COMPONENTS: any[] = [
 CreateUserComponent,
 ListUserComponent
];
const COMPONENTS_DYNAMIC: any[] = [];


@NgModule({
  declarations: [
    ...COMPONENTS, ...COMPONENTS_DYNAMIC
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
