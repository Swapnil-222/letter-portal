import { Component, Inject, OnInit } from '@angular/core';
import { OrganizationDTO } from '@shared/model/organizationDTO';
import { Location } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { HelperService, OperationsService } from '@shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { HearingDetailsDTO } from '@shared/model/HearingDetailsDTO';
import { DakMasterDTO } from '@shared/model/DakMasterDTO';
import { UserDTO } from '@shared/model/userDTO';
import { AuthService } from '@core';
import { Common } from '@shared/utils/common';
import { AppEventType } from '@shared/constants/app_event';
import { AppEvent } from '@shared/model/app_event_class';
import { EventQueueService } from '@shared/services/event_queue_service.service';

@Component({
  selector: 'app-hearing-details',
  templateUrl: './hearing-details.component.html',
  styleUrls: ['./hearing-details.component.css'],
})
export class HearingDetailsComponent implements OnInit {
  Hearingdetails!: HearingDetailsDTO;
  search: any = {};
  incomingData!: DakMasterDTO;
  formType: string = '';
  details!: DakMasterDTO;
  user: UserDTO;
  loginUser: UserDTO;
  today = new Date();

  hearingDate: Date;

  constructor(
    private location: Location,
    private router: Router,
    public dialogRef: MatDialogRef<HearingDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrganizationDTO,
    private operationService: OperationsService,
    private authService: AuthService,
    protected activatedRoute: ActivatedRoute,
    private helperService: HelperService,
    private auth: AuthService,
    private eventQueue: EventQueueService
  ) {
    this.incomingData = data;
    this.loginUser = this.authService.getUser();
  }

  ngOnInit(): void {
    this.user = this.auth.getUser();
    this.Hearingdetails = {
      id: undefined,
      accuserName: undefined,
      orderDate: undefined,
      respondentName: undefined,
      comment: undefined,
      date: undefined,
      time: undefined,
      status: undefined,
      lastModified: undefined,
      lastModifiedBy: undefined,
      dakMasterId: undefined,
      securityUser: undefined,
    };
  }

  onSave() {
    {
      this.Hearingdetails.status = HearingDetailsDTO.stautsEnum.HEARING;
      this.Hearingdetails.dakMasterId = this.incomingData.id;
      this.Hearingdetails.date = Common.getNextDate(this.hearingDate);
      this.subscribeToSaveResponse(this.operationService.createHearing(this.Hearingdetails));
      this.dialogRef.close();
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<HearingDetailsDTO>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.helperService.showSuccess('Success');

    let updatedDak: DakMasterDTO = this.incomingData;
    updatedDak.id = this.incomingData.id;
    (updatedDak.currentStatus = DakMasterDTO.currentStatusEnum.HEARING),
      (updatedDak.securityUsers!.id = this.user.id);

    this.subscribeToUpdateResponse(this.operationService.updateLetter(updatedDak));
     this.eventQueue.dispatch(new AppEvent(AppEventType.LETTER_STATE_CHANGE, null));
    this.eventQueue.dispatch(new AppEvent(AppEventType.ClickedOnNotification, null));

  }

  onSaveError(): void {
    this.helperService.showError('Fail');
  }

  previousState(): void {
    this.location.back();
  }

  protected subscribeToUpdateResponse(result: Observable<HttpResponse<DakMasterDTO>>): void {
    result.subscribe(
      () => this.onUpdateSuccess(),
      () => this.onUpdaateError()
    );
  }

  protected onUpdateSuccess(): void {}

  onUpdaateError(): void {
    this.helperService.showError('Fail');
  }
}
