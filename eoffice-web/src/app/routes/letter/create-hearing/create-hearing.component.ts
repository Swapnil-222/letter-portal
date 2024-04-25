import { formatDate } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AppEventType } from '@shared/constants/app_event';
import { AppEvent } from '@shared/model/app_event_class';
import { DakMasterDTO } from '@shared/model/DakMasterDTO';
import { HearingDetailsDTO } from '@shared/model/HearingDetailsDTO';
import { HelperService, LookupService, OperationsService } from '@shared/services';
import { EventQueueService } from '@shared/services/event_queue_service.service';
import { Common } from '@shared/utils/common';
import { format } from 'path';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-hearing',
  templateUrl: './create-hearing.component.html',
  styleUrls: ['./create-hearing.component.css'],
})
export class CreateHearingComponent implements OnInit {
  hearingDetails: HearingDetailsDTO;
  isSaving: boolean;
  hearingData: any;
  demo: any;
  today = new Date();
  clicked = false;
  currentHearingDetail: HearingDetailsDTO | undefined;
  dak_list: DakMasterDTO[] = [];
  hearingDate: Date;
  constructor(
    protected activatedRoute: ActivatedRoute,
    public operationService: OperationsService,
    public helperService: HelperService,
    public lookupService: LookupService,
    private eventQueue: EventQueueService,
    public dialogRef: MatDialogRef<CreateHearingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HearingDetailsDTO
  ) {
    this.hearingData = data;
  }

  ngOnInit(): void {
    if (this.hearingData.data != null) {
      this.hearingDetails = this.hearingData.data;


      this.lookupService
        .queryHearing({ 'dakMasterId.equals': this.hearingDetails.dakMasterId })
        .subscribe((res: HttpResponse<HearingDetailsDTO[]>) => {
          const temp: HearingDetailsDTO[] = [];
          const hearing_list = res.body != null ? res.body : temp;
          this.currentHearingDetail = hearing_list.pop();
        });
    } else {
      this.hearingDetails = {
        id: undefined,
        accuserName: undefined,
        orderDate: undefined,
        respondentName: undefined,
        comment: undefined,
        time: undefined,
        status: undefined,
        lastModified: undefined,
        lastModifiedBy: undefined,
        dakMasterId: undefined,
      };
    }
  }
  save() {
    this.isSaving = true;
    this.hearingDetails.id = undefined;
    let formattedDate = new Date(this.hearingDetails.date!= undefined ? this.hearingDetails.date: this.today);
    this.hearingDetails.date = Common.getNextDate(formattedDate);
    this.subscribeToSaveResponse(this.operationService.createHearing(this.hearingDetails));

  }
  hearingComplete() {
    this.isSaving = true;

    if (this.hearingDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.operationService.updateLetter(this.hearingDetails));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<any>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }
  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.eventQueue.dispatch(new AppEvent(AppEventType.LETTER_STATE_CHANGE, null));
    this.helperService.showSuccess('Success');
    this.dialogRef.close();
  }
  private onSaveError() {
    this.isSaving = false;
    this.dialogRef.close();
  }
  getPreviousDate(inputDateString: string = new Date().toJSON()): string {
    return Common.getPreviousDate(new Date(inputDateString));
  }

}
