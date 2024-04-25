import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/authentication';
import { UserDTO } from '@shared/model/userDTO';
import { HelperService } from '@shared/services/helper.service';
import { NgxRolesService } from 'ngx-permissions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-panel',
  template: `
    <div class="matero-user-panel" fxLayout="column" fxLayoutAlign="center center">
      <img class="matero-user-panel-avatar" [src]="user.avatar" alt="avatar" width="164" />
      <h4 class="matero-user-panel-name" style="color:#0085DA">
        <strong>{{ user.firstName }} {{ user.lastName }}</strong>
      </h4>
      <h6 class="matero-user-panel-role" style="margin-top: auto;margin-bottom: auto;">
        {{ user.designation }}
      </h6>
      <h6
        class="matero-user-panel-role"
        style="margin-top: auto;margin-bottom: auto;
      inline-size: 230px;overflow-wrap: break-word;text-align: center;"
      >
        {{ user.organization?.organizationName }}
      </h6>
      <div class="matero-user-panel-icons">
        <a (click)="logout()" mat-icon-button>
          <mat-icon class="icon-18">exit_to_app</mat-icon>
        </a>
      </div>
    </div>
  `,
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent implements OnInit {
  user!: UserDTO;


  constructor(
    private router: Router,
    public helperService: HelperService,
    private rolesService: NgxRolesService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.user().subscribe(user => (this.user = user));
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
}
