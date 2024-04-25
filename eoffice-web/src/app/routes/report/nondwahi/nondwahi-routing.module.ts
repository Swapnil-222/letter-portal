import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NondwahiComponent } from './nondwahi.component';

const routes: Routes = [{ path: '', component: NondwahiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NondwahiRoutingModule { }
