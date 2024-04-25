import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParameterRoutingModule } from './parameter-routing.module';
import { CreateParameterComponent } from './create-parameter/create-parameter.component';
import { ListParameterComponent } from './list-parameter/list-parameter.component';
import { SharedModule } from '@shared';


@NgModule({
  declarations: [
    CreateParameterComponent,
    ListParameterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ParameterRoutingModule
  ]
})
export class ParameterModule { }
