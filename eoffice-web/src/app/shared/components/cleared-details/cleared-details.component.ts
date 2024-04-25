import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core';
import { environment } from '@env/environment';
import { MtxAlertType } from '@ng-matero/extensions/alert';
import { AppEventType } from '@shared/constants/app_event';
import { AppEvent } from '@shared/model/app_event_class';
import { DakMasterDTO } from '@shared/model/DakMasterDTO';
import { OrganizationDTO } from '@shared/model/organizationDTO';
import { OutWardDTO } from '@shared/model/OutWardDTO';
import { UserDTO } from '@shared/model/userDTO';
import { HelperService, LookupService, OperationsService } from '@shared/services';
import { EventQueueService } from '@shared/services/event_queue_service.service';
import { map, Observable } from 'rxjs';



@Component({
  selector: 'app-cleared-details',
  templateUrl: './cleared-details.component.html',
  styleUrls: ['./cleared-details.component.css'],
})
export class ClearedDetailsComponent implements OnInit {
  sh : any;
  type: MtxAlertType = 'info';
  temp: any;
  details!: DakMasterDTO;
  user: UserDTO;
  incomingData!: DakMasterDTO;
  isChecked: 'true';
  hasOutward: true;
  @Input() criteria!: any;
  search: any = {};
  userList: DakMasterDTO[] = [];
  outwardnumber:DakMasterDTO| null;
  List: any;
  OutWardNumber: OutWardDTO[] = [];
  outwardDetail : OutWardDTO;
  constructor(
    private router: Router,
    private operationService: OperationsService,
    protected activatedRoute: ActivatedRoute,
    private helperService: HelperService,
    private auth: AuthService,
    private lookupService: LookupService,
    private eventQueue: EventQueueService,
    public dialogRef: MatDialogRef<ClearedDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrganizationDTO,
    private http: HttpClient
  ) {
    this.incomingData = data;
  }

  ngOnInit(): void {
    this.user = this.auth.getUser();
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
      lastModified: undefined,
      lastModifiedBy: undefined,
      dakAssignedFrom: undefined,
      dakAssignee: undefined,
      dispatchedBy: undefined,
      senderOutward: undefined,
      outwardNumber: undefined,
      taluka: undefined,
      organization: undefined,
      securityUsers: undefined,
      comment: undefined,
    };
    this.outwardDetail={
      outWardNumber : undefined,
    }
  }

  onSave() {
    if (this.temp == 'true') {
      let updatedDak: DakMasterDTO = this.incomingData;
      updatedDak.id = this.incomingData.id;
      updatedDak.hasOutward = true;
      (updatedDak.currentStatus = DakMasterDTO.currentStatusEnum.CLEARED),
        (updatedDak.comment = this.details.comment),
        this.subscribeToUpdateResponse(this.operationService.updateLetter(updatedDak));
    } else {
      let updatedDak: DakMasterDTO = this.incomingData;
      updatedDak.id = this.incomingData.id;
      (updatedDak.currentStatus = DakMasterDTO.currentStatusEnum.CLEARED),
        (updatedDak.comment = this.details.comment),
        this.subscribeToUpdateResponse(this.operationService.updateLetter(updatedDak));
    }
  }

  onSaveError(): void {
    this.helperService.showError('Fail');
    this.dialogRef.close();
  }

  previousState(): void {}

  protected subscribeToUpdateResponse(result: Observable<HttpResponse<DakMasterDTO>>): void {
    result.subscribe(
      () => this.onUpdateSuccess(),
      () => this.onUpdaateError()
    );
  }

  protected onUpdateSuccess(): void {
    this.helperService.showSuccess('Success');
    this.eventQueue.dispatch(new AppEvent(AppEventType.ClickedOnNotification, null));
    this.eventQueue.dispatch(new AppEvent(AppEventType.LETTER_STATE_CHANGE, null));
    this.dialogRef.close();
    this.router.navigateByUrl('/home/letter/cleared');
  }

  onUpdaateError(): void {
    this.helperService.showError('Fail');
  }
  outward() {
    this.details.hasOutward == true;
    this.details.currentStatus == 'CLEARED';
  }

  getOutWardNo(e) {
    const ordId =
      this.incomingData.organization?.id != undefined ? this.incomingData.organization?.id : 0;
    this.lookupService
    .getOutwardNumber(ordId)
    .subscribe((res: HttpResponse<OutWardDTO[]>) => {
      this.outwardDetail = res.body!= null ? res.body : this.List;
    });
  }
}
