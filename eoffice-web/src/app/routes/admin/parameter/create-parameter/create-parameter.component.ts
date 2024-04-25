import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ParamterLookupDTO } from '@shared/model/parameterLookupDTO';
import { HelperService, OperationsService } from '@shared/services';
import { Observable } from 'rxjs';
import { EventQueueService } from '@shared/services/event_queue_service.service';
import { AppEventType } from '@shared/constants/app_event';
import { AppEvent } from '@shared/model/app_event_class';

@Component({
  selector: 'app-create-parameter',
  templateUrl: './create-parameter.component.html',
  styleUrls: ['./create-parameter.component.css'],
})
export class CreateParameterComponent implements OnInit {
  parameterDetails!: ParamterLookupDTO;
  incomingData: any;
  constructor(
    public dialogRef: MatDialogRef<CreateParameterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ParamterLookupDTO,
    private operationService: OperationsService,
    private location: Location,
    private router: Router,
    private helperService: HelperService,
    private eventQueue: EventQueueService
  ) {
    this.incomingData = data;
  }

  ngOnInit(): void {
    if (this.incomingData != null) {
      this.parameterDetails = this.incomingData.data;
    } else {
      this.parameterDetails = {
        id: undefined,
        parameterName: undefined,
        parameterValue: undefined,
        type: undefined,
      };
    }
  }
  onSave() {
    if (this.parameterDetails.id != undefined) {
      this.subscribeToSaveResponse(this.operationService.updateParameter(this.parameterDetails));
    } else {
      this.parameterDetails.organization = { id: 1 };
      this.subscribeToSaveResponse(this.operationService.createParameter(this.parameterDetails));
    }
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<ParamterLookupDTO>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }
  protected onSaveSuccess(): void {
    this.helperService.showSuccess('Success');
    this.eventQueue.dispatch(new AppEvent(AppEventType.ClickedOnNotification, null));
    this.dialogRef.close();
  }

  onSaveError(): void {
    this.helperService.showError('Fail');
    this.dialogRef.close();
  }

  previousState(): void {
    this.location.back();
  }
}
