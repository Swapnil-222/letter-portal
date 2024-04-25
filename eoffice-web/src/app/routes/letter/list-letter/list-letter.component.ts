import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { TablesRemoteDataService } from './remote-data.service';
import { MatDialog } from '@angular/material/dialog';
import { SelfGenLetterComponent } from '../self-gen-letter/self-gen-letter.component';
import { DakMasterDTO } from '@shared/model/DakMasterDTO';
import { HttpResponse } from '@angular/common/http';
import { HelperService, LookupService } from '@shared/services';
import { AssignedToComponentComponent } from '@shared/components/assigned-to-component/assigned-to-component.component';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@core';
import { ITEMS_PER_PAGE } from '@shared/constants/pagination.constants';
import { UserDTO } from '@shared/model/userDTO';
import { CreateHearingComponent } from '../create-hearing/create-hearing.component';
import { SecurityUserDTO } from '@shared/model/securityUserDTO';
import { HearingDetailsDTO } from '@shared/model/HearingDetailsDTO';
import { FormControl, FormGroup } from '@angular/forms';
import { DakAssigneeDTO } from '@shared/model/dakAssigneeDTO';
import { Common } from '@shared/utils/common';
import { EventQueueService } from '@shared/services/event_queue_service.service';
import { AppEventType } from '@shared/constants/app_event';

@Component({
  selector: 'app-list-letter',
  templateUrl: './list-letter.component.html',
  styleUrls: ['./list-letter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TablesRemoteDataService],
})
export class ListLetterComponent implements OnInit {
  today = new Date();
  details!: DakMasterDTO;
  pageContext = {
    page: 0,
    previousPage: 0,
    itemsPerPage: 0,
    totalItems: 0,
    sort: 'id,desc',
  };
  range: any = {};
  hideElement = false;
  type: any = {};
  temp: any;
  isShown: boolean = false;
  isChecked: 'true';
  markerList: SecurityUserDTO[] | any[];
  transferDetails: DakMasterDTO;
  search: any = {};
  currentNav: any;
  user!: UserDTO;
  myRole!: string;
  userList: SecurityUserDTO[] = [];
  hearingList: HearingDetailsDTO[] = [{}];
  currentUrl: any;
  isHearing: boolean;
  receivedlessDate: Date;
  receivedGreaterDate: Date;
  downloading = false;
  searchletter: any = {};
  dakAssignee: DakAssigneeDTO[] = [];
  selectid: any = '';
  inwardnumberfrom: any = '';
  format = 'pdf';
  inwardNoFrom: any;
  inwardNoTo: any;
  filteredInverd: any;
  openDialog() {
    const dialogRef = this.dialog.open(SelfGenLetterComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  columns: MtxGridColumn[] = [
    {
      header: this.translate.instant('menu.id'),
      field: 'id',
      width: '50px',
    },
    {
      header: this.translate.instant('menu.inwardNumber'),
      field: 'inwardNumber',
      sortable: 'true',
      showExpand: false,
    },
    {
      header: this.translate.instant('menu.letterDate'),
      field: 'letterDate',
      formatter: (data: any) => moment(data.letterDate).format('DD/MM/yyyy'),
    },
    {
      header: this.translate.instant('menu.letterReceivedDate'),
      field: 'letterReceivedDate',
      formatter: (data: any) => moment(data.letterReceivedDate).format('DD/MM/yyyy'),
    },
    {
      header: this.translate.instant('menu.createdOn'),
      field: 'createdOn',
      formatter: (data: any) => moment(data.createdOn).format('DD/MM/yyyy'),
    },
    {
      header: this.translate.instant('menu.senderName'),
      field: 'senderName',
    },
    {
      header: this.translate.instant('menu.subject'),
      field: 'subject',
      width: '300px',
    },
  ];
  list: DakMasterDTO[] = [];
  hearing_list: HearingDetailsDTO[] = [];
  total = 0;
  isLoading = true;
  isSaving = true;

  constructor(
    public lookupService: LookupService,
    public helperService: HelperService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public dialog: MatDialog,
    private translate: TranslateService,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private eventQueue: EventQueueService
  ) {
    this.pageContext.itemsPerPage = ITEMS_PER_PAGE;
    this.pageContext.totalItems = ITEMS_PER_PAGE;
    this.user = this.authService.getUser();
  }

  ngOnInit() {
    this.eventQueue.on(AppEventType.LETTER_STATE_CHANGE).subscribe(event => this.handleEvent());
    this.range = new FormGroup({
      letterGreaterDate: new FormControl(),
      letterlesserDate: new FormControl(),
    });


    this.myRole = this.user?.roles![0];

    this.search['securityUsersId.equals'] = this.user.id;
    this.search['organizationId.equals'] = this.user.organization?.id;

    this.lookupService
      .queryHearing(this.search)
      .subscribe((res: HttpResponse<HearingDetailsDTO[]>) => {
        const temp: HearingDetailsDTO[] = [];
        this.hearingList = res.body != null ? res.body : temp;
      });

    this.lookupService
      .querySecurityUser({
        'organizationId.equals': this.user.organization?.id,
        'securityRoleId.equals': 6,
      })
      .subscribe((res: HttpResponse<SecurityUserDTO[]>) => {
        const temp: SecurityUserDTO[] = [];
        this.markerList = res.body != null ? res.body : temp;
      });
      this.activatedRoute.url.subscribe(route => {
        this.currentNav = route;
        this.search = {};
        this.buildUpCriteriaBasedOnRole();

        this.queryData();
      });


  }
  handleEvent(): void {
    this.search = {};
    this.buildUpCriteriaBasedOnRole();

    this.queryData();
  }
  buildUpCriteriaBasedOnRole() {
    if (this.myRole == 'ROLE_EMP') {
      if (this.currentNav[0].path == 'my-assignment') {
        this.search['currentStatus.in'] = [
          DakMasterDTO.currentStatusEnum.ASSIGNED,
          DakMasterDTO.currentStatusEnum.AWAITED,
          DakMasterDTO.currentStatusEnum.HEARING,
          DakMasterDTO.currentStatusEnum.AWAITED_FOR_ORDER,
        ];

        this.search['organizationId.equals'] = this.user.organization?.id;
        this.search['dakAssignee.equals'] = this.user.id;
      } else if (this.currentNav[0].path == 'cleared') {
        this.search['currentStatus.in'] = DakMasterDTO.currentStatusEnum.CLEARED;
        this.search['dakAssignee.equals'] = this.user.id;
      } else if (this.currentNav[0].path == 'hearings') {
        this.search['currentStatus.in'] = [
          DakMasterDTO.currentStatusEnum.HEARING,
          DakMasterDTO.currentStatusEnum.HEARING_AWAITED,
          DakMasterDTO.currentStatusEnum.HEARING_COMPLETED,
        ];
        this.search['organizationId.equals'] = this.user.organization?.id;
        this.search['dakAssignee.equals'] = this.user.id;
      }

      if (!this.coloumnExists()) {
        this.columns.push({
          header: this.translate.instant('menu.currentStatus'),
          field: 'currentStatus',
        });
        if (this.currentNav[0].path == 'hearings') {
          this.loadColoumnForHeadOffice();
          this.hearingColumn();
          this.operationsColumns();
        }
      }
    } else if (this.myRole == 'ROLE_MARKER') {
      if (this.currentNav[0].path == 'dispatched') {
        this.search['dakAssignee.equals'] = this.selectid;
        this.search['dakAssignedFrom.equals'] = this.user.id;
        this.columns = [];
        this.loadDefaultColoumn();
      }
    } else if (this.myRole == 'ROLE_CLERK') {
      if (this.currentNav[0].path == 'new-letters-clerk') {
        this.search['currentStatus.equals'] = DakMasterDTO.currentStatusEnum.CREATED;
      } else if (this.currentNav[0].path == 'assigned') {
        this.search['currentStatus.in'] = [
          DakMasterDTO.currentStatusEnum.ASSIGNED,
          DakMasterDTO.currentStatusEnum.HEARING,
          DakMasterDTO.currentStatusEnum.AWAITED_FOR_ORDER,
          DakMasterDTO.currentStatusEnum.AWAITED,
          DakMasterDTO.currentStatusEnum.CLEARED,
        ];
        this.search['dispatchedBy.equals'] = this.user.id;
        this.loadDefaultColoumn();
      }
    } else if (this.myRole == 'ROLE_HEAD_OFFICE') {
      if (this.currentNav[0].path == 'letter-list') {
        this.search['dakAssignee.equals'] = this.selectid;
        this.columns = [];
        this.loadDefaultColoumn();
        this.search['currentStatus.in'] = [
          DakMasterDTO.currentStatusEnum.CREATED,
          DakMasterDTO.currentStatusEnum.UPDATED,
          DakMasterDTO.currentStatusEnum.ASSIGNED,
          DakMasterDTO.currentStatusEnum.HEARING,
          DakMasterDTO.currentStatusEnum.AWAITED,
          DakMasterDTO.currentStatusEnum.AWAITED_FOR_ORDER,
          DakMasterDTO.currentStatusEnum.HEARING_AWAITED,
          DakMasterDTO.currentStatusEnum.HEARING_COMPLETED,
          DakMasterDTO.currentStatusEnum.PENDING,
        ];

        if (!this.coloumnExists()) {
          this.columns.push({
            header: this.translate.instant('menu.currentStatus'),
            field: 'currentStatus',
          });
        }
      } else if (this.currentNav[0].path == 'hearings') {
        this.columns = [];
        this.loadColoumnForHeadOffice();
        this.hearingColumn();
        this.search['currentStatus.equals'] = DakMasterDTO.currentStatusEnum.HEARING;
        this.search['dakAssignee.equals'] = this.selectid;
      } else if (this.currentNav[0].path == 'cleared') {
        this.search['currentStatus.equals'] = DakMasterDTO.currentStatusEnum.CLEARED;
        this.columns = [];
        this.loadDefaultColoumn();

        if (!this.coloumnExists()) {
          this.columns.push({
            header: this.translate.instant('menu.currentStatus'),
            field: 'currentStatus',
          });
        }
      }
    }
  }
  loadDefaultColoumn() {
    this.columns = [
      {
        header: this.translate.instant('menu.id'),
        field: 'id',
        width: '50px',
      },
      {
        header: this.translate.instant('menu.inwardNumber'),
        field: 'inwardNumber',
        sortable: 'true',
        showExpand: false,
      },

      {
        header: this.translate.instant('menu.letterReceivedDate'),
        field: 'letterReceivedDate',
        formatter: (data: any) => moment(data.letterReceivedDate).format('DD/MM/yyyy'),
      },
      {
        header: this.translate.instant('menu.createdOn'),
        field: 'createdOn',
        formatter: (data: any) => moment(data.createdOn).format('DD/MM/yyyy'),
      },
      {
        header: this.translate.instant('menu.senderName'),
        field: 'senderName',
        width: '144px',
      },
      {
        header: this.translate.instant('menu.subject'),
        field: 'subject',
        width: '300px',
      },
      {
        header: this.translate.instant('menu.dakAssignee'),
        field: 'dakAssignee.firstName',
        width: '170px',
        // formatter: data =>
        // this.getAssignee(data.dakAssignee?.firstName + ' ' + data.dakAssignee?.lastName),
        formatter: data =>
          this.getAssignee(data),
      },
    ];
  }
  loadColoumnForHeadOffice() {
    this.columns = [
      {
        header: this.translate.instant('menu.id'),
        field: 'id',
        width: '50px',
      },
      {
        header: this.translate.instant('menu.inwardNumber'),
        field: 'inwardNumber',
        sortable: 'true',
        showExpand: false,
      },

      { header: this.translate.instant('menu.senderOutward'), field: 'senderOutward' },
      {
        header: this.translate.instant('menu.subject'),
        field: 'subject',
      },
    ];
  }
  coloumnExists() {
    var i: number;
    for (i = 0; i < this.columns.length; i++) {
      if (this.columns[i].field == 'currentStatus') {
        return true;
      }
    }
    return false;
  }

  hearingColumn() {
    this.columns.push(
      {
        header: this.translate.instant('dak.title.accuserName'),
        field: 'hearingDetails[0].accuserName',
        formatter: data => `<span>${data.hearingDetails[0]?.accuserName}`,
      },
      {
        header: this.translate.instant('dak.title.respondentName'),
        field: 'hearingDetails[0].respondentName',
        formatter: data => `<span>${data.hearingDetails[0]?.respondentName}`,
      },
      {
        header: this.translate.instant('dak.title.date'),
        field: 'hearingDetails[0].date',
        formatter: (data: any) => moment(this.getPreviousDate(data.hearingDetails[0]?.date)).format('DD/MM/yyyy'),
      },
      {
        header: this.translate.instant('dak.title.time'),
        field: 'hearingDetails[0].time',
        formatter: data => `<span>${data.hearingDetails[0]?.time}`,
      }
    );
  }
  operationsColumns() {
    this.columns.push({
      header: this.translate.instant('menu.operations'),
      field: 'operation',
      minWidth: 100,
      width: '170px',
      pinned: 'right',
      type: 'button',
      buttons: [
        {
          icon: 'assign',
          text: this.translate.instant('menu.asignedto'),
          type: 'basic',
          color: 'primary',
          tooltip: 'assigned to',
          click: record => this.assignedTo(record),
          iif: (data: any) =>
            (this.myRole == 'ROLE_CLERK' && this.currentNav[0].path == 'new') ||
            (this.myRole == 'ROLE_MARKER' && this.currentNav[0].path == 'new'),
        },
        {
          icon: 'event',
          type: 'basic',
          color: 'primary',
          tooltip: 'Create Next Hearing',
          click: data => this.hearing(data),
        },
      ],
    });
  }

  edit(data: any): void {
    this.router.navigateByUrl('/home/letter/editLetter/' + data.id);
  }

  hearing(data: any) {
    if (data) {
      let record = data.id;
      data.hearingDetails[0].dakMasterId = record;
    }
    var payload = {
      data: data.hearingDetails[0],
      flag: 'nextHearing',
      inwardNo: data.inwardNumber,
    };
    const dialogRef = this.dialog.open(CreateHearingComponent, {
      width: '40%',
      data: payload,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  view(data: any): void {
    this.router.navigateByUrl('/home/letter/viewLetter/' + data.id);
  }
  queryData() {
    this.list = [];
    this.isLoading = true;
    this.search.page = this.pageContext.page;
    this.search.size = this.pageContext.itemsPerPage;
    this.search.sort = this.pageContext.sort;
    Common.removeEmptyFields(this.search);
    this.search['organizationId.equals'] = this.user.organization?.id;

    if (this.inwardNoFrom != undefined || this.inwardNoTo != undefined) {
      this.search = {};
      (this.search['dakAssignedfromId'] = this.user.id),
        (this.search['organizationId'] = this.user.organization?.id),
        (this.search['dakAssignedToId'] = this.selectid),
        (this.search['inwardNoFrom'] = this.inwardNoFrom),
        (this.search['inwardNoTo'] = this.inwardNoTo);

      this.lookupService
        .queryForLetterFilter(this.search)
        .subscribe((res: HttpResponse<DakMasterDTO[]>) => {
          let header = res.headers;
          this.pageContext.totalItems = header != null ? Number(header.get('x-total-count')) : 0;
          const temp: DakMasterDTO[] = [];
          this.list = res.body != null ? res.body : temp;
          this.isLoading = false;
          this.cdr.detectChanges();
        });
    } else {

      if(this.filteredInverd != undefined){
        this.search={}
        this.search['inwardNumber.in']=this.filteredInverd
      }

      this.lookupService
        .queryForLetterList(this.search)
        .subscribe((res: HttpResponse<DakMasterDTO[]>) => {
          const headers = res.headers;
          this.pageContext.totalItems =
            headers != null ? Number(headers.get('x-total-count')?.toString()) : 0;
          const temp: DakMasterDTO[] = [];
          this.list = res.body != null ? res.body : temp;
          this.isLoading = false;
          this.cdr.detectChanges();
        });

      this.lookupService
        .querySecurityUser(this.search)
        .subscribe((res: HttpResponse<SecurityUserDTO[]>) => {
          const temp: SecurityUserDTO[] = [];
          this.userList = res.body != null ? res.body : temp;
        });

      this.lookupService.queryHearing().subscribe((res: HttpResponse<HearingDetailsDTO[]>) => {
        const temp: HearingDetailsDTO[] = [];
        this.hearing_list = res.body != null ? res.body : temp;
        this.cdr.detectChanges();
      });
    }
  }

  searchDate() {
    if (Common.isNotEmpty(this.range.letterGreaterDate)) {
      let GreaterDate = JSON.stringify(this.range.letterGreaterDate).substring(1, 25);
      this.search['letterReceivedDate.greaterThanOrEqual'] = GreaterDate;
    }
    if (Common.isNotEmpty(this.range.letterlesserDate)) {
      let lesserDate = JSON.stringify(this.range.letterlesserDate).substring(1, 25);
      this.search['letterReceivedDate.lessThanOrEqual'] = lesserDate;
    }
  }
  changeSort(e: any) {
    this.pageContext.sort = e.active + ',' + e.direction;
    this.pageContext.page = 0;
    this.searchDate();
    this.queryData();
  }

  onPageChange(e: any) {
    this.pageContext.page = e.pageIndex;
    this.pageContext.previousPage = e.previousPageIndex;
    this.pageContext.itemsPerPage = e.pageSize;
    this.searchDate();
    this.queryData();
  }

  add() {
    this.router.navigateByUrl('home/letter/create');
  }

  navigatetoSelfLetter() {
    this.router.navigateByUrl('home/letter/selfgen');
  }
  previousState() {
    this.router.navigateByUrl('/home/dashboard');
  }

  onSearch(reset: boolean = false) {
    this.searchDate();
    if (reset) {
      this.search = {};
      this.selectid = '';
      this.inwardNoFrom = undefined;
      this.inwardNoTo = undefined;
      this.range.letterGreaterDate = '';
      this.range.letterlesserDate = '';
      this.filteredInverd = undefined;
    }
    this.buildUpCriteriaBasedOnRole();
    this.queryData();
  }

  assignedTo(record: DakMasterDTO) {
    const dialogRef = this.dialog.open(AssignedToComponentComponent, {
      height: '500px',
      width: '500px',
      data: record,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.queryData();
    });
  }

  getAssignee(data: any) {
    // this.dakAssignee.forEach(element => {
    //   element.fullName = element?.firstName + ' ' + element?.lastName;
    // });
    // return fullName;
    let fname=data.dakAssignee?.firstName!= undefined ? data.dakAssignee.firstName: '-';
    let lname=data.dakAssignee?.lastName!= undefined ? data.dakAssignee.lastName: '-';
    let fullname = fname +' '+ lname;
    data = fullname

    return data;
  }
  toggleShow() {
    this.isShown = !this.isShown;
  }
  getMyIndex(index: number): number {
    if (this.pageContext.page > 0) {
      return this.pageContext.page * this.pageContext.itemsPerPage + index;
    }

    return index;
  }
  searchUser(search) {
    this.search['firstName.equals'] = search.term;
    this.lookupService
      .querySecurityUser(this.search)
      .subscribe((res: HttpResponse<SecurityUserDTO[]>) => {
        const temp: SecurityUserDTO[] = [];
        this.markerList = res.body != null ? res.body : temp;
      });
  }
  downloadReport(isPrint: boolean = false) {
    {
      this.helperService.showReportWait('Report will take time. Please wait!!!');
      this.downloading = true;
      this.searchletter['dakAssignedFrom.equals'] = this.user.id;
      this.searchletter['organizationId.equals'] = this.user.organization?.id;
      this.searchletter['dakAssignee.equals'] = this.selectid;
      this.lookupService
        .downloadAssignedReport(this.searchletter)
        .subscribe((res: HttpResponse<any>) => {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(new Blob([res.body], { type: 'application/pdf' }));
          a.download =
            'marker_assigned letter_report' + moment().format('YYYY-MM-DD') + '.' + this.format;
          if (isPrint) {
            window.open(a.href);
          } else {
            document.body.appendChild(a);
            a.click();
          }
          this.helperService.showSuccess('Success');
          this.downloading = false;
        });
    }
  }
  getPreviousDate(inputDateString: string = new Date().toJSON()): string {
    return Common.getPreviousDate(new Date(inputDateString));
  }
  // checkForEmppty(input:any):boolean
  // {
  //   return Common.isNotEmpty(input);
  // }
}
