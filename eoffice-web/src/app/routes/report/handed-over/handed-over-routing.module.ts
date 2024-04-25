import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HandedOverComponent } from './handed-over.component';

const routes: Routes = [{ path: '', component: HandedOverComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HandedOverRoutingModule { }
