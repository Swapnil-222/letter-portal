import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core';
import { AppEventType } from '@shared/constants/app_event';
import { AppEvent } from '@shared/model/app_event_class';
import { DakMasterDTO } from '@shared/model/DakMasterDTO';
import { OrganizationDTO } from '@shared/model/organizationDTO';
import { UserDTO } from '@shared/model/userDTO';
import { HelperService, OperationsService } from '@shared/services';
import { EventQueueService } from '@shared/services/event_queue_service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-await-detail',
  templateUrl: './await-detail.component.html',
  styleUrls: ['./await-detail.component.css'],
})
export class AwaitDetailComponent implements OnInit {
  incomingData!: DakMasterDTO;
  details: DakMasterDTO;
  user: UserDTO;
  constructor(
    private helperService: HelperService,
    public dialogRef: MatDialogRef<AwaitDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrganizationDTO,
    private auth: AuthService,
    private operationService: OperationsService,
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    private eventQueue: EventQueueService
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
    };
  }
  onSave() {
    this.dialogRef.close();
    let updatedDak: DakMasterDTO = this.incomingData;
    updatedDak.id = this.incomingData.id;
    (updatedDak.currentStatus = DakMasterDTO.currentStatusEnum.AWAITED),
      (updatedDak.awaitReason = this.details.awaitReason),
      this.subscribeToUpdateResponse(this.operationService.updateLetter(updatedDak));
    this.router.navigateByUrl('/home/letter/my-assignment');
  }
  protected onSaveSuccess(): void {
    this.helperService.showSuccess('Dak Awaited  Successfully');
    this.eventQueue.dispatch(new AppEvent(AppEventType.ClickedOnNotification, null));
    this.eventQueue.dispatch(new AppEvent(AppEventType.LETTER_STATE_CHANGE, null));

    this.dialogRef.close();
  }

  onSaveError(): void {
    this.helperService.showError('Fail');
    this.dialogRef.close();
  }

  previousState(): void {
  }

  protected subscribeToUpdateResponse(result: Observable<HttpResponse<DakMasterDTO>>): void {
    result.subscribe(
      () => this.onUpdateSuccess(),
      () => this.onUpdaateError(),
      () => this.onSaveSuccess()
    );
  }

  protected onUpdateSuccess(): void {
  }

  onUpdaateError(): void {
    this.helperService.showError('Fail');
  }
}
