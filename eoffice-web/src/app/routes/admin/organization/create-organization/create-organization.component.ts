import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { OrganizationDTO } from '@shared/model/organizationDTO';
import { Location } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { HelperService, OperationsService } from '@shared/services';
import { Router } from '@angular/router';
import { EventQueueService } from '@shared/services/event_queue_service.service';
import { AppEventType } from '@shared/constants/app_event';
import { AppEvent } from '@shared/model/app_event_class';
@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.css'],
})
export class CreateOrganizationComponent implements OnInit {
  organizationDetails!: OrganizationDTO;
  incomingData: any;
  formType: string = '';
  isActivated: boolean | undefined;

  constructor(
    private location: Location,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<CreateOrganizationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrganizationDTO,
    private operationService: OperationsService,
    private helperService: HelperService,
    private eventQueue: EventQueueService
  ) {
    this.incomingData = data;
  }

  ngOnInit(): void {
    if (this.incomingData != null) {
      this.organizationDetails = this.incomingData.data;
      this.formType = this.incomingData.formType;
    } else {
      this.organizationDetails = {
        id: undefined,
        organizationName: undefined,
        orgnizationType: undefined,
        address: undefined,
        description: undefined,
        isActivate: undefined,
      };
    }
  }

  onSave() {
    if (this.organizationDetails.id != undefined) {
      this.subscribeToSaveResponse(
        this.operationService.updateOrganization(this.organizationDetails)
      );
    } else {
      this.organizationDetails.isActivate = true;
      this.subscribeToSaveResponse(
        this.operationService.createOrganization(this.organizationDetails)
      );
    }
    this.cdr.detectChanges();
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<OrganizationDTO>>): void {
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
