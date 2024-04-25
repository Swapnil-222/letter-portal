import { HttpResponse } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { HearingDetailsDTO } from '@shared/model/HearingDetailsDTO';
import { LookupService } from '@shared/services';
import { map, of } from 'rxjs';
import { CommentsComponent } from './comments/comments.component';
import { HearingComplitedComponent } from './hearing-complited/hearing-complited.component';
import { HearingDetailsComponent } from './hearing-details/hearing-details.component';
import { LetterDetailsComponent } from './letter-details/letter-details.component';

@Injectable({ providedIn: 'root' })
export class DetailResolve implements Resolve<HearingDetailsDTO[] | null> {
  constructor(public lookupService: LookupService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.lookupService
        .queryHearing(id)
        .pipe(map((res: HttpResponse<HearingDetailsDTO[]>) => res.body));
    }
    return of(null);
  }
}
const routes: Routes = [
  { path: 'comment', component: CommentsComponent },
  { path: 'hearings', component: HearingDetailsComponent },
  { path: 'details', component: LetterDetailsComponent },
  { path: 'hearing-Completed', component: HearingComplitedComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsRoutingModule { }
