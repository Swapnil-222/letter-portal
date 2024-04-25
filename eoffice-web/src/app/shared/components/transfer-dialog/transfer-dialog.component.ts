import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DakMasterDTO } from '@shared/model/DakMasterDTO';
import { SecurityUserDTO } from '@shared/model/securityUserDTO';
import { HelperService, LookupService, OperationsService } from '@shared/services';
import { HttpResponse } from '@angular/common/http';
import { UserDTO } from '@shared/model/userDTO';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventQueueService } from '@shared/services/event_queue_service.service';
import { Observable } from 'rxjs';
import { AppEventType } from '@shared/constants/app_event';
import { AppEvent } from '@shared/model/app_event_class';
import { AuthService } from '@core';
@Component({
  selector: 'app-transfer-dialog',
  templateUrl: './transfer-dialog.component.html',
  styleUrls: ['./transfer-dialog.component.css'],
})
export class TransferDialogComponent implements OnInit {
  transferDetails: DakMasterDTO;
  incomingData!: DakMasterDTO;
  markerList: SecurityUserDTO[] | null;
  user!: UserDTO;
  search: any = {};
  assignedTo: number | undefined;
  selectedIndex: number;
  loginUser: UserDTO;
  selectedMarker: number | any;
  isSaving!: boolean;
  constructor(
    protected activatedRoute: ActivatedRoute,
    public lookupService: LookupService,
    private operationService: OperationsService,
    private helperService: HelperService,
    private authService: AuthService,
    private router: Router,
    private eventQueue: EventQueueService,
    private auth: AuthService,
    public dialogRef: MatDialogRef<TransferDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DakMasterDTO
  ) {
    this.incomingData = data;
    this.loginUser = this.authService.getUser();
  }

  ngOnInit(): void {
    this.user = this.auth.getUser();
    this.transferDetails = {
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
    this.activatedRoute.data.subscribe(({ transferDetails }) => {
      if (transferDetails != null) {
        this.transferDetails = transferDetails;
        this.selectedMarker = this.transferDetails.securityUsers?.id;
      }
    });
    this.search['securityRoleId.equals'] = 5;
    this.search['organizationId.equals'] = this.user.organization?.id;
    this.search['activated.in'] = false;
    this.lookupService
      .querySecurityUser(this.search)
      .subscribe((pres: HttpResponse<SecurityUserDTO[]>) => {
        this.markerList = pres.body;
      });
  }
  selectedMarkerId(e: any) {
    this.assignedTo = e;
    console.log('selected MArker____' + JSON.stringify(e));
  }
  searchClient(search: any) {
    this.search['clientName.contains'] = search.term;
    this.lookupService
      .queryMarkerList({ 'roleName.equals': 'ROLE_MARKER' })
      .subscribe((res: HttpResponse<SecurityUserDTO[]>) => {
        const temp: SecurityUserDTO[] = [];
        this.markerList = res.body != null ? res.body : temp;
      });
  }
  onSave() {
    let updatedDak: DakMasterDTO = this.incomingData;
    updatedDak.id = this.incomingData.id;
    updatedDak.dispatchedBy = { id: this.user.id };
    updatedDak.dakAssignedFrom = { id: this.user.id };
    updatedDak.securityUsers!.id = this.user.id;
    updatedDak.organization = { id: this.loginUser.organization?.id };
    updatedDak.dakAssignee = { id: this.assignedTo };
    (updatedDak.comment = this.transferDetails.comment),
      this.subscribeToUpdateResponse(this.operationService.updateTranferLetter(updatedDak));
  }
  protected onSaveSuccess(): void {
    this.helperService.showSuccess('Dak Tranfer Successfully...!!');
    this.eventQueue.dispatch(new AppEvent(AppEventType.ClickedOnNotification, null));
    this.eventQueue.dispatch(new AppEvent(AppEventType.LETTER_STATE_CHANGE, null));
    this.router.navigateByUrl('/home/letter/my-assignment');
    this.dialogRef.close();
  }

  onSaveError(): void {
    this.helperService.showError('Fail');
    this.dialogRef.close();
  }

   protected subscribeToUpdateResponse(result: Observable<HttpResponse<DakMasterDTO>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }
}
