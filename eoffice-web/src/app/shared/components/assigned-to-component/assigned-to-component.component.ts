import { Component, Inject, OnInit } from '@angular/core';
import { SecurityUserDTO } from '@shared/model/securityUserDTO';
import { HelperService, LookupService, OperationsService } from '@shared/services';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DakMasterDTO } from '@shared/model/DakMasterDTO';
import { formatDate, Location } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '@core';
import { UserDTO } from '@shared/model/userDTO';
import { AppEventType } from '@shared/constants/app_event';
import { AppEvent } from '@shared/model/app_event_class';
import { EventQueueService } from '@shared/services/event_queue_service.service';
@Component({
  selector: 'app-assigned-to-component',
  templateUrl: './assigned-to-component.component.html',
  styleUrls: ['./assigned-to-component.component.css'],
})
export class AssignedToComponentComponent implements OnInit {
  assigneeList: SecurityUserDTO[] | undefined;
  search: any = {};
  isLoading!: boolean;
  tempDate: string;
  loginUser: UserDTO;
  pageContext = { page: 0, previousPage: 0, itemsPerPage: 0, totalItems: 0, sort: 'id,desc' };
  markerList!: SecurityUserDTO[];
  selectedMarker!: number;
  isSaving!: boolean;
  assignedTo: number | undefined;
  details!: DakMasterDTO;
  letterData: DakMasterDTO;
  user!: UserDTO;
  today = new Date();
  constructor(
    public lookupService: LookupService,
    private operationService: OperationsService,
    private helperService: HelperService,
    private location: Location,
    private eventQueue: EventQueueService,
    public dialogRef: MatDialogRef<AssignedToComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DakMasterDTO,
    public authService: AuthService
  ) {
    this.letterData = data;
    console.log('this.details+++' + JSON.stringify(this.letterData));
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    console.log('this.user+++' + JSON.stringify(this.user));
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
      assignedDate: this.getDate(),
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

    if (this.letterData != null) {
      this.details = this.letterData;
    }
    this.queryData();
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
        this.markerList = res.body != null ? res.body : temp;
        this.isLoading = false;
      });
  }

  searchClient(search: any) {
    this.search['clientName.contains'] = search.term;
    this.lookupService
      .queryMarkerList(this.search)
      .subscribe((res: HttpResponse<SecurityUserDTO[]>) => {
        const temp: SecurityUserDTO[] = [];
        this.markerList = res.body != null ? res.body : temp;
      });
  }

  selectedMarkerId(e: SecurityUserDTO) {
    this.assignedTo = e?.id;
    console.log('selected MArker____' + JSON.stringify(e));
  }
  getDate() {
    let localDate = new Date();
    this.tempDate = JSON.stringify(localDate).substring(1, 25);
    return this.tempDate;
  }

  assignedtoMarker() {
    this.details.dakAssignedFrom = { id: this.user.id };
    this.details.securityUsers!.id = this.user.id;
    this.details.dispatchedBy = { id: this.user.id };
    this.details.currentStatus = DakMasterDTO.currentStatusEnum.ASSIGNED;
    this.details.organization = { id: 1 };
    this.details.dispatchDate = this.getDate();
    this.details.lastModified = this.getDate();
    this.details.lastModifiedBy = this.loginUser.login;
    this.details.dakAssignee = { id: this.assignedTo };
    this.subscribeToSaveResponse(this.operationService.updateLetter(this.details));
    console.log(this.getDate);
    alert('Dak assiged  Successfully !!');
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<DakMasterDTO>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }
  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.helperService.showSuccess('Dak Assigned Successfully..!!');
    this.previousPage();
    this.eventQueue.dispatch(new AppEvent(AppEventType.ClickedOnNotification, null));
  }
  private onSaveError() {
    this.isSaving = false;
  }

  previousPage() {
    this.location.back();
  }
}
