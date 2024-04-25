import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LetterRoutingModule } from './letter-routing.module';
import { CreateLetterComponent } from './create-letter/create-letter.component';
import { ListLetterComponent } from './list-letter/list-letter.component';
import { SharedModule } from '@shared';
import { SelfGenLetterComponent } from './self-gen-letter/self-gen-letter.component';
import { ViewLetterComponent } from './view-letter/view-letter.component';
import { EditableListComponent } from './editable-list/editable-list.component';
import { CreateHearingComponent } from './create-hearing/create-hearing.component';
@NgModule({
  declarations: [
    CreateLetterComponent,
    ListLetterComponent,
    SelfGenLetterComponent,
    ViewLetterComponent,
    EditableListComponent,
    CreateHearingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LetterRoutingModule
  ]
})
export class LetterModule { }
