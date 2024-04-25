import { Component, NgIterable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DakMasterDTO } from '@shared/model/DakMasterDTO';
import { HearingDetailsDTO } from '@shared/model/HearingDetailsDTO';
import { MatDialog } from '@angular/material/dialog';
import { HelperService, LookupService, OperationsService } from '@shared/services';
import { HearingDetailsComponent } from '../details/hearing-details/hearing-details.component';
import { Location } from '@angular/common';
import { ClearedDetailsComponent } from '@shared/components/cleared-details/cleared-details.component';
import { TransferDialogComponent } from '@shared/components/transfer-dialog/transfer-dialog.component';
import { AwaitDetailComponent } from '@shared/components/await-detail/await-detail.component';
import { CreateHearingComponent } from '../create-hearing/create-hearing.component';
import { HttpResponse } from '@angular/common/http';
import { HearingComplitedComponent } from '../details/hearing-complited/hearing-complited.component';
import { CommentMasterDTO } from '@shared/model/CommentMasterDTO';
import { Common } from '@shared/utils/common';
import { EventQueueService } from '@shared/services/event_queue_service.service';
import { AppEventType } from '@shared/constants/app_event';
@Component({
  selector: 'app-view-letter',
  templateUrl: './view-letter.component.html',
  styleUrls: ['./view-letter.component.css'],
})
export class ViewLetterComponent implements OnInit {
  pageContext = {
    page: 0,
    previousPage: 0,
    itemsPerPage: 0,
    totalItems: 0,
    sort: 'date,desc',
  };
  details!: DakMasterDTO;
  commentDetails: CommentMasterDTO[] = [{}];
  commentDetail: CommentMasterDTO;
  hearingDetails!: HearingDetailsDTO;
  isSaving: boolean | undefined;
  search: any = {};
  myRole!: string;
  hearingList: HearingDetailsDTO[] = [{}];
  commentList: CommentMasterDTO[] = [];
  letterList: DakMasterDTO[] = [{}];
  data: any;
  currentStatus: string | undefined;
  comment: string | undefined;
  today: Date = new Date();
  hearings: HearingDetailsDTO | NgIterable<any> | null;
  isDisabled: boolean = false;
  hearingData: HearingDetailsDTO;
  currentDate = new Date();
  hearingDataaaaaaa: unknown;
  currentHearingDetail: CommentMasterDTO | undefined;
  constructor(
    protected activatedRoute: ActivatedRoute,
    public operationService: OperationsService,
    public helperService: HelperService,
    private router: Router,
    private dialog: MatDialog,
    public lookupService: LookupService,
    private location: Location,
    private eventQueue: EventQueueService
  ) {}

  ngOnInit(): void {
    this.eventQueue.on(AppEventType.LETTER_STATE_CHANGE).subscribe(event => this.handleEvent());

    this.hearingDataaaaaaa = this.location.getState();
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
      letterStatus: undefined,
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
    this.hearingDetails = {
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
    };
    this.commentDetail = {
      id: undefined,
      description: undefined,
      createdOn: undefined,
      createdBy: undefined,
      status: undefined,
      lastModified: undefined,
      lastModifiedBy: undefined,
      securityUser: undefined,
      dakMaster: undefined,
    };
    this.activatedRoute.data.subscribe(({ details }) => {
      if (details != null) {
        this.details = details;

        this.loadDataForLetterDetails();
      }
    });
  }
  loadDataForLetterDetails() {
    this.search['dakMasterId.equals'] = this.details.id;

    this.lookupService
      .queryHearing(this.search)
      .subscribe((res: HttpResponse<HearingDetailsDTO[]>) => {
        const temp: HearingDetailsDTO[] = [];
        this.hearingList = res.body != null ? res.body : temp;
      });

    this.currentStatus = this.details.currentStatus;

    this.lookupService.queryForLetterList().subscribe((res: HttpResponse<DakMasterDTO[]>) => {
      const temp: DakMasterDTO[] = [];
      this.letterList = res.body != null ? res.body : temp;
    });

    this.lookupService
      .getComment(this.search)
      .subscribe((res: HttpResponse<CommentMasterDTO[]>) => {
        const temp: CommentMasterDTO[] = [];
        const commentList = res.body != null ? res.body : temp;
        this.currentHearingDetail = commentList.pop();

      });
  }
  handleEvent(): void {
    this.loadDataForLetterDetails();
  }
  previousState(): void {
    this.location.back();
  }
  save() {}
  back() {
    this.router.navigateByUrl('/home/letter/new/cleark');
  }
  addHearing() {
    const dialogRef = this.dialog.open(HearingDetailsComponent, {
      width: '40%',
      data: this.details,
    });
    dialogRef.afterClosed().subscribe(result => {
      this.hearingData = result;
    });
  }
  addCleared() {
    this.dialog.open(ClearedDetailsComponent, {
      width: '40%',
      data: this.details,
    });
  }
  openTransfer() {
    const dialogRef = this.dialog.open(TransferDialogComponent, {
      data: this.details,
      width: '40%',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  addAwait() {
    this.dialog.open(AwaitDetailComponent, {
      width: '40%',
      data: this.details,
    });
  }
  hearingComplited() {
    this.dialog.open(HearingComplitedComponent, {
      width: '40%',
      data: this.details,
    });
  }
  addNextHearing() {
    var payload = {
      data: this.hearingList[0],
      flag: 'nextHearing',
      inwardNo : this.details.inwardNumber,
    };

    this.dialog.open(CreateHearingComponent, {
      width: '40%',
      data: payload,
    });
  }
  changeSort(e: any) {
    this.pageContext.sort = e.active + ',' + e.direction;
    this.pageContext.page = 0;
    this.ngOnInit();
  }

  getPreviousDate(inputDateString: string = new Date().toJSON()): string {
    return Common.getPreviousDate(new Date(inputDateString));
  }
}
