import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsRoutingModule } from './details-routing.module';
import { LetterDetailsComponent } from './letter-details/letter-details.component';
import { HearingDetailsComponent } from './hearing-details/hearing-details.component';
import { CommentsComponent } from './comments/comments.component';
import { SharedModule } from '@shared';
import { HearingComplitedComponent } from './hearing-complited/hearing-complited.component';


@NgModule({
  declarations: [
    LetterDetailsComponent,
    HearingDetailsComponent,
    CommentsComponent,
    HearingComplitedComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DetailsRoutingModule
  ]
})
export class DetailsModule { }
