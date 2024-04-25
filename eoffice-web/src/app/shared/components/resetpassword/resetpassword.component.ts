import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '@core';
import { SecurityUserDTO } from '@shared/model/securityUserDTO';
import { UserDTO } from '@shared/model/userDTO';
import { HelperService, LookupService, OperationsService } from '@shared/services';
import { NgxRolesService } from 'ngx-permissions';
import { debounceTime, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  list: SecurityUserDTO[] = [];
  user: UserDTO;
  currentPassword:string;
  newPassword:string;
  confirmPassword:string;
  isSaving = false;
  error: boolean;
  hide = true;
  hidee = true;
  hideee = true;
  userDtoList: SecurityUserDTO | null;
  constructor(
    private router: Router,
    private auth: AuthService,
    public lookupService: LookupService,
    public helperService: HelperService,
    private operationService : OperationsService,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ResetpasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDTO,
  ) {

  }

  ngOnInit(): void {
    this.auth
      .user()
      .pipe(
        tap(user => (this.user = user)),
        debounceTime(10)
      )
      .subscribe(() => this.cdr.detectChanges());
      this.user = this.auth.getUser();
      console.log((this.user));
      // this.lookupService
      // .querySecurityUserList({'id.equals': this.user.id})
      // .subscribe((res: HttpResponse<SecurityUserDTO>) => {
      //   this.userDtoList = res.body!=null? res.body: null;
      //   console.log('userDetails+++++'+JSON.stringify(this.userDtoList![0].passwordHash));
      // });

  }
  save(): void {
    this.isSaving = true;
    this.error = false;
    if (this.newPassword !== this.confirmPassword) {
    } else {
      this.operationService
        .changePassword(this.newPassword , this.currentPassword)
        .subscribe(
          () => ( (this.isSaving = false),(this.helperService.showSuccess("Password changed!"))),
          () => ((this.error = true), (this.isSaving = false))
        );
    }
    this.dialogRef.close();
  }
}
