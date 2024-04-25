import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportRoutingModule } from './report-routing.module';
import { SharedModule } from '@shared';
import { InwardRegisterComponent } from './inward-register/inward-register.component';
import { InwardRegisterModule } from './inward-register/inward-register.module';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    SharedModule,
    ReportRoutingModule,
    InwardRegisterModule
  ]
})
export class ReportModule { }
