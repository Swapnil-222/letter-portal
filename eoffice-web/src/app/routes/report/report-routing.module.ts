import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'nondwahi', loadChildren: () => import('./nondwahi/nondwahi.module').then(m => m.NondwahiModule) },
  { path: 'goshwara', loadChildren: () => import('./ghoshwara/ghoshwara.module').then(m => m.GhoshwaraModule) },
  { path: 'handed-over', loadChildren: () => import('./handed-over/handed-over.module').then(m => m.HandedOverModule) },
  { path: 'inward-register', loadChildren: () => import('./inward-register/inward-register.module').then(m => m.InwardRegisterModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
