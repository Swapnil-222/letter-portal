import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InwardRegisterRoutingModule } from './inward-register-routing.module';
import { InwardRegisterComponent } from './inward-register.component';
import { SharedModule } from '@shared';


@NgModule({
  declarations: [
    InwardRegisterComponent
  ],
  imports: [
    CommonModule,
    InwardRegisterRoutingModule,
    SharedModule
  ]
})
export class InwardRegisterModule { }
