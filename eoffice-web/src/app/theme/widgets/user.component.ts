import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, tap } from 'rxjs/operators';
import { AuthService, User } from '@core/authentication';
import { UserDTO } from '@shared/model/userDTO';
import { HelperService } from '@shared/services/helper.service';
import { NgxRolesService } from 'ngx-permissions';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ResetpasswordComponent } from '@shared/components/resetpassword/resetpassword.component';
import { MatDialog } from '@angular/material/dialog';
import { LookupService } from '@shared/services';

@Component({
  selector: 'app-user',
  template: `
    <button
      class="matero-toolbar-button matero-avatar-button"
      mat-button
      [matMenuTriggerFor]="menu"
    >
      <img class="matero-avatar" [src]="user.avatar" width="32" alt="avatar" />
      <span class="matero-username" fxHide.lt-sm>{{ user.firstName }} {{ user.lastName }}</span>
    </button>

    <mat-menu #menu="matMenu">
      <button mat-menu-item>
        <mat-icon>account_circle</mat-icon>
        <span>  {{ user.roles }} </span>
      </button>
      <button  mat-menu-item *ngIf="this.user.roles![0] != 'ROLE_SUPER_ADMIN'">
        <mat-icon>account_balance</mat-icon>
        <span> {{ user.organization?.organizationName }}</span>
      </button>
      <button mat-menu-item  (click)="onReset()">
        <mat-icon>password</mat-icon>
        <span>{{ 'user.reset' | translate }}</span>
      </button>
      <button mat-menu-item (click)="logout()">
        <mat-icon>exit_to_app</mat-icon>
        <span>{{ 'user.logout' | translate }}</span>
      </button>
    </mat-menu>
  `,
})
export class UserComponent implements OnInit {
  user!: UserDTO;
  loginUser: HttpResponse<any>;

  constructor(
    private router: Router,
    private auth: AuthService,
    public helperService: HelperService,
    private rolesService: NgxRolesService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private lookupService: LookupService,
  ) {}

  ngOnInit(): void {
    this.auth
      .user()
      .pipe(
        tap(user => (this.user = user)),
        debounceTime(10)
      )
      .subscribe(() => this.cdr.detectChanges());
  }

  logout() {
    this.subscribeToSaveResponse(this.auth.logout());
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<any>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.helperService.showSuccess('Successfully loged out!!');
    this.rolesService.flushRolesAndPermissions();
    this.router.navigateByUrl('/auth/login');
  }

  private onSaveError() {
    this.helperService.showError('Something went wrong!!');
  }
  onReset(){
    this.lookupService.userLoginDetails().subscribe((res)=>{
      this.loginUser = res;
    });
    this.dialog.open(ResetpasswordComponent, {
      width: '27%',
    });
  }
}
