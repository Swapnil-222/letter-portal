import { HttpResponse } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { SecurityUserDTO } from '@shared/model/securityUserDTO';
import { UserDTO } from '@shared/model/userDTO';
import { LookupService } from '@shared/services';
import { map, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CreateUserComponent } from './create-user/create-user.component';
import { ListUserComponent } from './list-user/list-user.component';


@Injectable({providedIn: 'root'})
export class UserResolver implements Resolve<SecurityUserDTO[] | any> {
  constructor(private lookupService: LookupService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.params.id ? route.params.id :null;
    if(id){
      return this.lookupService
        .getSecurityUserById(id)
        .pipe(map((res: HttpResponse<SecurityUserDTO[] | any>) => res.body));
    }
    return of(null);
  }

}

const routes: Routes = [
  { path: 'create', component: CreateUserComponent },
  {
    path: ':operation/:id',
    component: CreateUserComponent,
    resolve: {
      userDetails: UserResolver
    }
  },
  { path: '', component: ListUserComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
