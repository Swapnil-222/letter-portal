import { Component, OnInit } from '@angular/core';
import { DakMasterDTO } from '@shared/model/DakMasterDTO';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AppEventType } from '@shared/constants/app_event';
import { AppEvent } from '@shared/model/app_event_class';
import { SecurityUserDTO } from '@shared/model/securityUserDTO';
import { HelperService, LookupService, OperationsService } from '@shared/services';
import { EventQueueService } from '@shared/services/event_queue_service.service';
import { Observable } from 'rxjs';
import { UserDTO } from '@shared/model/userDTO';
import { OrganizationDTO } from '@shared/model/organizationDTO';
import { AuthService } from '@core';
import { DakAssigneeDTO } from '@shared/model/dakAssigneeDTO';
import { DakAssignedFromDTO } from '@shared/model/dakAssignedFromDTO';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-self-gen-letter',
  templateUrl: './self-gen-letter.component.html',
  styleUrls: ['./self-gen-letter.component.css'],
})
export class SelfGenLetterComponent implements OnInit {
  details!: DakMasterDTO;
  isSaving: boolean | undefined;
  loginUser: UserDTO;
  tempDate: string;
  today = new Date();
  organization?: OrganizationDTO;
  dakAssignee?: DakAssigneeDTO;
  dakAssignedFrom?: DakAssignedFromDTO;
  user: DakMasterDTO;
  securityUsers?: SecurityUserDTO;
  assignedTo: number | undefined;
  search: any = {};
  empUser: UserDTO;
  isLoading!: boolean;
  clicked = false;
  pageContext = { page: 0, previousPage: 0, itemsPerPage: 0, totalItems: 0, sort: 'id,desc' };
  userList: SecurityUserDTO[] = [];
  constructor(
    protected activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<SelfGenLetterComponent>,
    public operationService: OperationsService,
    public helperService: HelperService,
    private router: Router,
    public lookupService: LookupService,
    private eventQueue: EventQueueService,
    private authService: AuthService
  ) {
    this.loginUser = this.authService.getUser();
  }

  ngOnInit(): void {
    this.details = {
      id: undefined,
      inwardNumber: undefined,
      senderName: undefined,
      contactNumber: undefined,
      senderAddress: undefined,
      senderEmail: undefined,
      subject: undefined,
      letterDate: undefined,
      currentStatus: undefined,
      letterReceivedDate: undefined,
      awaitReason: undefined,
      dispatchDate: undefined,
      createdBy: undefined,
      letterType: undefined,
      isResponseReceived: undefined,
      assignedDate: undefined,
      lastModified: this.getDate(),
      lastModifiedBy: this.loginUser.login,
      dakAssignedFrom: undefined,
      dakAssignee: undefined,
      dispatchedBy: undefined,
      senderOutward: undefined,
      outwardNumber: undefined,
      taluka: undefined,
      organization: undefined,
      securityUsers: undefined,
    };
    this.activatedRoute.data.subscribe(({ details }) => {
      if (details != null) {
        this.details = details;
      }
    });
  }
  queryData() {
    this.isLoading = true;
    this.search.page = this.pageContext.page;
    this.search.size = this.pageContext.itemsPerPage;
    this.search.sort = this.pageContext.sort;
    this.lookupService
      .queryMarkerList(this.search)
      .subscribe((res: HttpResponse<SecurityUserDTO[]>) => {
        const temp: SecurityUserDTO[] = [];
        this.userList = res.body != null ? res.body : temp;
        this.isLoading = false;
      });
  }

  saveSGL() {
    this.isSaving = true;
    this.router.navigateByUrl('/home/letter/my-assignment');
    this.details.lastModified = this.getDate();
    this.details.lastModifiedBy = this.loginUser.login;
    this.details.createdOn = this.getDate();
    this.details.organization = { id: this.loginUser.organization?.id };

    if (this.details.id !== undefined) {
      this.details.currentStatus = DakMasterDTO.currentStatusEnum.CREATED;
      this.subscribeToSaveResponse(this.operationService.updateLetter(this.details));
    } else {
      this.details.dakAssignee = { id: this.loginUser?.id };
      this.details.currentStatus = DakMasterDTO.currentStatusEnum.ASSIGNED;
      this.details.letterType = DakMasterDTO.letterTypeEnum.SELF;
      this.details.assignedDate = this.getDate();
      this.details.letterReceivedDate = this.getDate();
      this.subscribeToSaveResponse(this.operationService.createLetter(this.details));
    }
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<DakMasterDTO>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }
  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.helperService.showSuccess('Success');
    this.dialogRef.close();
    this.router.navigateByUrl('/home/letter/my-assignment');
    this.eventQueue.dispatch(new AppEvent(AppEventType.ClickedOnNotification, null));
    this.eventQueue.dispatch(new AppEvent(AppEventType.LETTER_STATE_CHANGE, null));
  }
  private onSaveError() {
    this.isSaving = false;
    this.dialogRef.close();
  }
  cancel() {
    this.router.navigateByUrl('/home/letter/my-assignment');
  }
  getDate() {
    let localDate = new Date();
    this.tempDate = JSON.stringify(localDate).substring(1, 25);
    return this.tempDate;
  }
}
