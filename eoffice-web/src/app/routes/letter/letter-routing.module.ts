import { HttpResponse } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { DakMasterDTO } from '@shared/model/DakMasterDTO';
import { CreateLetterComponent } from './create-letter/create-letter.component';
import { ListLetterComponent } from './list-letter/list-letter.component';
import { SelfGenLetterComponent } from './self-gen-letter/self-gen-letter.component';
import { LookupService } from '@shared/services';
// import { HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ViewLetterComponent } from './view-letter/view-letter.component';
import { EditableListComponent } from './editable-list/editable-list.component';
import { HearingDetailsComponent } from './details/hearing-details/hearing-details.component';
import { DetailsModule } from './details/details.module';
import { CreateHearingComponent } from './create-hearing/create-hearing.component';

@Injectable({ providedIn: 'root' })
export class DetailResolve implements Resolve<DakMasterDTO[] | null> {
  constructor(public lookupService: LookupService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.lookupService
        .getLetterById(id)
        .pipe(map((res: HttpResponse<DakMasterDTO[]>) => res.body));
    }
    return of(null);
  }
}
const routes: Routes = [
  {
    path: 'create',
    component: CreateLetterComponent
  },
  { path: 'editLetter/:id',
    component: CreateLetterComponent,
    resolve: {
      details: DetailResolve,
    },
  },
  { path: 'viewLetter/:id',
    component: ViewLetterComponent,
    resolve: {
      details: DetailResolve,
    },
  },
  { path: 'new-letters-clerk', component: EditableListComponent, data: {status:'recentlyadded',role:'ROLE_CLERK'} },
  { path: 'new-letters-marker', component: EditableListComponent, data: {status:'recentlyadded',role:'ROLE_MARKER'} },
  { path: 'assigned', component: ListLetterComponent, data: {status:'assigned',role:'ROLE_CLERK'} },
  { path: 'assigned-marker', component: ListLetterComponent, data: {status:'assigned',role:'ROLE_MARKER'} },
  { path: 'my-assignment', component: ListLetterComponent, data: {status:'assigned',role:'ROLE_EMP'} },
  { path: 'letter-list', component: ListLetterComponent, data: {role:'ROLE_HEAD_OFFICE'} },
  { path: 'dispatched', component: ListLetterComponent, data: {status:'assigned',role:'ROLE_MARKER'} },
  { path: 'myletters', component: ListLetterComponent, data: {status:'assigned',role:'ROLE_MARKER'} },
  { path: 'cleared', component: ListLetterComponent, data: {status:'assigned',role:'ROLE_MARKER'} },
  { path: 'selfgen', component: SelfGenLetterComponent },
  { path: 'hearings', component: ListLetterComponent, data: {status:'hearings', role:'ROLE_EMP'} },
  { path: 'details', loadChildren: () => import('./details/details.module').then(m => m.DetailsModule) },
  { path: 'createhearings',
    component: CreateHearingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LetterRoutingModule {}
