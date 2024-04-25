import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateParameterComponent } from './create-parameter/create-parameter.component';
import { ListParameterComponent } from './list-parameter/list-parameter.component';

const routes: Routes = [
  { path: 'create', component: CreateParameterComponent },
  { path: '', component: ListParameterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParameterRoutingModule { }
