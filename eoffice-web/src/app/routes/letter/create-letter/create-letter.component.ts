import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core';
import { AppEventType } from '@shared/constants/app_event';
import { AppEvent } from '@shared/model/app_event_class';
import { DakMasterDTO } from '@shared/model/DakMasterDTO';
import { UserDTO } from '@shared/model/userDTO';
import { HelperService, LookupService, OperationsService } from '@shared/services';
import { EventQueueService } from '@shared/services/event_queue_service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-letter',
  templateUrl: './create-letter.component.html',
  styleUrls: ['./create-letter.component.css'],
})
export class CreateLetterComponent implements OnInit {
  details!: DakMasterDTO;
  tempDate: string;
  loginUser: UserDTO;
  isSaving: boolean | undefined;
  today = new Date();
  user!: UserDTO;
  clicked = false;
  constructor(
    protected activatedRoute: ActivatedRoute,
    public operationService: OperationsService,
    public helperService: HelperService,
    private router: Router,
    private authService: AuthService,
    public lookupService: LookupService,
    private eventQueue: EventQueueService
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
      createdOn: this.getDate(),
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
    this.details.letterType = "INWARD";
    this.activatedRoute.data.subscribe(({ details }) => {
      if (details != null) {
        this.details = details;
      }
    });
  }
  getDate() {
    let localDate = new Date();
    this.tempDate = JSON.stringify(localDate).substring(1, 25);
    return this.tempDate;
  }

  save() {
    this.isSaving = true;
    this.details.lastModified = this.getDate();
    this.details.lastModifiedBy = this.loginUser.login;
    this.details.securityUsers = {id: this.loginUser.id};
    this.details.organization = {id: this.loginUser.organization?.id}

    if (this.details.id !== undefined) {
      this.details.currentStatus = DakMasterDTO.currentStatusEnum.CREATED;
      this.subscribeToSaveResponse(this.operationService.updateLetter(this.details));
    } else {
      this.details.currentStatus = DakMasterDTO.currentStatusEnum.CREATED;
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
    this.router.navigateByUrl('/home/letter/new-letters-clerk');
    this.eventQueue.dispatch(new AppEvent(AppEventType.ClickedOnNotification, null));
  }
  private onSaveError() {
    this.isSaving = false;
  }
  cancel() {
    this.router.navigateByUrl('/home/letter/new-letters-clerk');
  }
}
