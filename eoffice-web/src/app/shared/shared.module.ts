import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MaterialModule } from '../material.module';
import { MaterialExtensionsModule } from '../material-extensions.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import { NgProgressRouterModule } from 'ngx-progressbar/router';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { ErrorCodeComponent } from './components/error-code/error-code.component';
import { DisableControlDirective } from './directives/disable-control.directive';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { ToObservablePipe } from './pipes/to-observable.pipe';
import { PaginatorComponent } from './paginator/paginator.component';
import { AssignedToComponentComponent } from './components/assigned-to-component/assigned-to-component.component';
import { EditableLetterListComponent } from './components/editable-letter-list/editable-letter-list.component';
import { AuthorityHideDirective } from './directives/authority-hide.directive';
import { AuthorityShowDirective } from './directives/authority-show.directive';
import { ClearedDetailsComponent } from './components/cleared-details/cleared-details.component';
import { TransferDialogComponent } from './components/transfer-dialog/transfer-dialog.component';
import { AwaitDetailComponent } from './components/await-detail/await-detail.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';

const MODULES: any[] = [
  CommonModule,
  RouterModule,
  ReactiveFormsModule,
  FormsModule,
  MaterialModule,
  MaterialExtensionsModule,
  FlexLayoutModule,
  FormlyModule,
  FormlyMaterialModule,
  NgProgressModule,
  NgProgressRouterModule,
  NgProgressHttpModule,
  NgxPermissionsModule,
  ToastrModule,
  TranslateModule,
];
const COMPONENTS: any[] = [
  BreadcrumbComponent,
  PageHeaderComponent,
  ErrorCodeComponent,
  PaginatorComponent,
  AssignedToComponentComponent,
  EditableLetterListComponent,
];
const COMPONENTS_DYNAMIC: any[] = [];
const DIRECTIVES: any[] = [
  DisableControlDirective,
  AuthorityHideDirective,
  AuthorityShowDirective,];
const PIPES: any[] = [SafeUrlPipe, ToObservablePipe];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES, ...COMPONENTS, ...DIRECTIVES, ...PIPES],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC, ...DIRECTIVES, ...PIPES, ClearedDetailsComponent, TransferDialogComponent, AwaitDetailComponent, ResetpasswordComponent],
})
export class SharedModule {}
