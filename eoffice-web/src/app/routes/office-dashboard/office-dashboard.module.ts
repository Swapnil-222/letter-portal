import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfficeDashboardRoutingModule } from './office-dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TodaysHearingComponent } from './todays-hearing/todays-hearing.component';
import { SharedModule } from '@shared';
import { MaterialModule } from 'app/material.module';


const COMPONENTS = [DashboardComponent];
const COMPONENTS_DYNAMIC = [];
@NgModule({
  declarations: [
  TodaysHearingComponent,
  ...COMPONENTS

  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    OfficeDashboardRoutingModule,

  ]
})
export class OfficeDashboardModule { }
