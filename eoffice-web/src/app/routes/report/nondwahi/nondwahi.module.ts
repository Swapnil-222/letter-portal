import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NondwahiRoutingModule } from './nondwahi-routing.module';
import { NondwahiComponent } from './nondwahi.component';
import { SharedModule } from '@shared';


@NgModule({
  declarations: [
    NondwahiComponent
  ],
  imports: [
    CommonModule,
    NondwahiRoutingModule,
    SharedModule
  ]
})
export class NondwahiModule { }
