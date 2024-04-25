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
  selector: 'app-hearing-complited',
  templateUrl: './hearing-complited.component.html',
  styleUrls: ['./hearing-complited.component.css'],
})
export class HearingComplitedComponent implements OnInit {
  incomingData!: DakMasterDTO;
  user: UserDTO;
  constructor(
    private helperService: HelperService,
    public dialogRef: MatDialogRef<HearingComplitedComponent>,
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
  }

  hearingCompleted() {
    let updatedDak: DakMasterDTO = this.incomingData;
    updatedDak.id = this.incomingData.id;
    (updatedDak.currentStatus = DakMasterDTO.currentStatusEnum.AWAITED_FOR_ORDER),
      this.subscribeToUpdateResponse(this.operationService.updateLetter(updatedDak));
  }
  protected onSaveSuccess(): void {
    this.helperService.showSuccess('Success');
    this.dialogRef.close();
    this.eventQueue.dispatch(new AppEvent(AppEventType.ClickedOnNotification, null));
    this.eventQueue.dispatch(new AppEvent(AppEventType.LETTER_STATE_CHANGE, null));

    this.router.navigateByUrl('/home/letter/my-assignment');
  }

  onSaveError(): void {
    this.helperService.showError('Fail');
    this.dialogRef.close();
  }

  previousState(): void {}

  protected subscribeToUpdateResponse(result: Observable<HttpResponse<DakMasterDTO>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onUpdaateError()
    );
  }

  protected onUpdateSuccess(): void {}

  onUpdaateError(): void {
    this.helperService.showError('Fail');
  }
}
