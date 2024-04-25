import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GhoshwaraRoutingModule } from './ghoshwara-routing.module';
import { GhoshwaraComponent } from './ghoshwara.component';
import { SharedModule } from '@shared';


@NgModule({
  declarations: [
    GhoshwaraComponent
  ],
  imports: [
    CommonModule,
    GhoshwaraRoutingModule,
    SharedModule
  ]
})
export class GhoshwaraModule { }
