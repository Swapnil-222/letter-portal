import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateOrganizationComponent } from './create-organization/create-organization.component';
import { ListOrganizationComponent } from './list-organization/list-organization.component';

const routes: Routes = [
  { path: 'create', component: CreateOrganizationComponent },
  { path: '', component: ListOrganizationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationRoutingModule {}
