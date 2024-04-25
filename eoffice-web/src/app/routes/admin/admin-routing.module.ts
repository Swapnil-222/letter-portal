import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
 { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
 { path: 'parameter', loadChildren: () => import('./parameter/parameter.module').then(m => m.ParameterModule) },
 { path: 'organization', loadChildren: () => import('./organization/organization.module').then(m => m.OrganizationModule) }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
