import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HandedOverRoutingModule } from './handed-over-routing.module';
import { HandedOverComponent } from './handed-over.component';
import { SharedModule } from '@shared';


@NgModule({
  declarations: [
    HandedOverComponent
  ],
  imports: [
    CommonModule,
    HandedOverRoutingModule,
    SharedModule
  ]
})
export class HandedOverModule { }
