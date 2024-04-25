import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InwardRegisterComponent } from './inward-register.component';

const routes: Routes = [{ path: '', component: InwardRegisterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InwardRegisterRoutingModule { }
