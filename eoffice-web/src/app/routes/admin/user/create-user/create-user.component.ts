import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HelperService, LookupService, OperationsService } from '@shared/services';
import { HttpResponse } from '@angular/common/http';
import { isEmpty, map, Observable } from 'rxjs';
import { SecurityUserDTO } from '@shared/model/securityUserDTO';
import { OrganizationDTO } from '@shared/model/organizationDTO';
import { ParamterLookupDTO } from '@shared/model/parameterLookupDTO';
import { AuthService } from '@core';
import { UserDTO } from '@shared/model/userDTO';
import { SecurityRoleDTO } from '@shared/model/securityRoleDTO';
import { EventQueueService } from '@shared/services/event_queue_service.service';
import { AppEvent } from '@shared/model/app_event_class';
import { AppEventType } from '@shared/constants/app_event';
import { Common } from '@shared/utils/common';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent implements OnInit {
  userDetails: SecurityUserDTO;
  isSaving: boolean | undefined;
  currentUrl: any;
  parameterDesList!: ParamterLookupDTO[];
  organizationList: OrganizationDTO[];
  securityRoleList!: SecurityRoleDTO[];
  isLoading!: boolean;
  userRole!: any;
  search: any = {};
  data: any = [];
  user: UserDTO = { organization: { id: undefined }, roles: [] };
  organizationDetails: OrganizationDTO;
  selectedOrganization: number;
  selectedRole: number;
  section: any;
  suser: any;
  formattedWord: any;
  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private operationService: OperationsService,
    private helperService: HelperService,
    private cdr: ChangeDetectorRef,
    private lookupService: LookupService,
    private authService: AuthService,
    private eventQueue: EventQueueService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();

    this.activatedRoute.url.subscribe(url => {
      console.log('activated Route+++++' + JSON.stringify((this.currentUrl = url)));
    });

    this.userDetails = {
      id: undefined,
      firstName: undefined,
      address: undefined,
      gender: undefined,
      username: undefined,
      lastName: undefined,
      designation: undefined,
      businessTitle: undefined,
      login: undefined,
      passwordHash: undefined,
      confirmPassword: undefined,
      email: undefined,
      imageUrl: undefined,
      activated: false,
      langKey: undefined,
      activationKey: undefined,
      resetKey: undefined,
      resetDate: undefined,
      mobileNo: undefined,
      oneTimePassword: undefined,
      otpExpiryTime: undefined,
      createdBy: undefined,
      createdOn: undefined,
      lastModified: undefined,
      lastModifiedBy: undefined,
      organization: undefined,
      securityPermissions: undefined,
      securityRoles: undefined,
    };

    this.activatedRoute.data.subscribe(({ userDetails }) => {
      if (userDetails != null) {
        this.userDetails = userDetails;
        this.selectedOrganization = userDetails.organization?.id;
        this.selectedRole = userDetails.securityRoles[0]?.id;
      }
    });

    this.lookupService
      .queryParameterList(this.search)
      .subscribe((res: HttpResponse<ParamterLookupDTO[]>) => {
        let temp: ParamterLookupDTO[] = [];
        this.parameterDesList = res.body != null ? res.body : temp;
        this.isLoading = false;
      });

    this.lookupService
      .getSecurityRoleList({ 'roleName.notEquals': 'ROLE_SUPER_ADMIN' })
      .subscribe((res: HttpResponse<SecurityRoleDTO[]>) => {
        let temp: SecurityRoleDTO[] = [];
        this.securityRoleList = res.body != null ? res.body : temp;
        this.isLoading = false;
      });

    if (this.user.roles![0] != 'ROLE_SUPER_ADMIN') {
      this.search['organizationId.equals'] = this.user.organization?.id;
    }

    this.lookupService
      .getOrganizationList({ 'isActivate.equals': true })
      .subscribe((res: HttpResponse<OrganizationDTO[]>) => {
        let temp: OrganizationDTO[] = [];
        this.organizationList = res.body != null ? res.body : temp;
        this.isLoading = false;
      });
  }

  onCancel() {
    this.location.back();
  }
  save() {
    this.lookupService
      .querySecurityUser({
        'username.contains': this.formattedWord,
      })
      .subscribe((res: HttpResponse<SecurityUserDTO[]>) => {
        let temp: SecurityUserDTO[] = [];
        let user = res.body != null ? res.body : temp;
        if (!Common.isEmpty(user)) {
          this.helperService.showError('User name or Email already exist');
        } else {
          this.cdr.detectChanges();
          if (this.userDetails.id !== undefined) {
            this.userDetails.organization = { id: this.selectedOrganization };
            this.userDetails.securityRoles = [{ id: this.selectedRole }];
            // For Admin Role
            if (this.user.roles![0] == 'ROLE_ORG_ADMIN') {
              this.userDetails.organization = this.user.organization;
            }
            this.subscribeToSaveResponse(
              this.operationService.updateSecurityUser(this.userDetails)
            );
          } else {
            this.userDetails.organization = { id: this.selectedOrganization };
            this.userDetails.securityRoles = [{ id: this.selectedRole }];
            if (this.user.roles![0] == 'ROLE_ORG_ADMIN') {
              this.userDetails.organization = this.user.organization;
            }
            this.subscribeToSaveResponse(
              this.operationService.createSecurityUser(this.userDetails)
            );
          }
        }
      });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<any>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.helperService.showSuccess('Success');
    this.previousState();
    this.eventQueue.dispatch(new AppEvent(AppEventType.ClickedOnNotification, null));
  }

  onSaveError(): void {
    this.helperService.showError('Fail');
  }

  previousState(): void {
    this.location.back();
  }

  changeLowerCase(textToLower: any) {
    this.formattedWord = textToLower.target.value.toLowerCase();
  }
}
