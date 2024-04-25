import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GhoshwaraComponent } from './ghoshwara.component';

const routes: Routes = [{ path: '', component: GhoshwaraComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GhoshwaraRoutingModule { }
