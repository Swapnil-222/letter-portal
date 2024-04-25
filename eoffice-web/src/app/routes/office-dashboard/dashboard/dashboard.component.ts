import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AuthService, SettingsService } from '@core';
import { TopMenuDTO } from '@shared/model/topMenuDTO';
import { DashboardService } from './dashboard.service';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { HelperService, LookupService } from '@shared/services';
import { DakMasterDTO } from '@shared/model/DakMasterDTO';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { CountDTO } from '@shared/model/countDTO';
import { TranslateService } from '@ngx-translate/core';
import { ITEMS_PER_PAGE } from '@shared/constants/pagination.constants';
import { UserDTO } from '@shared/model/userDTO';
import { EmployeeInwardCounts } from '@shared/model/EmployeeInwardCounts';
import { Router } from '@angular/router';
import { SecurityUserDTO } from '@shared/model/securityUserDTO';
import { HearingDetailsDTO } from '@shared/model/HearingDetailsDTO';
import { DakAssigneeDTO } from '@shared/model/dakAssigneeDTO';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
    `
      .mat-raised-button {
        margin-right: 8px;
        margin-top: 8px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DashboardService],
})
export class DashboardComponent implements OnInit {
  list: HearingDetailsDTO[] = [];
  downloading = false;
  searchletter: any = {};
  format = 'pdf';
  pageContext = { page: 0, previousPage: 0, itemsPerPage: 0, totalItems: 0, sort: 'id,asc' };
  pageContext1 = { page: 0, previousPage: 0, itemsPerPage: 0, totalItems: 0, sort: 'id,asc' };
  search: any = {};
  userList: SecurityUserDTO[] = [];
  letterList: DakMasterDTO[] = [];
  dakAssignee: DakAssigneeDTO[] = [];
  hearingList: HearingDetailsDTO[] = [];
  topCardIndex!: number;
  stats: TopMenuDTO[] = [];
  isActivated: boolean | undefined;
  columns: MtxGridColumn[] = [
    {
      header: this.translate.instant('menu.id'),
      field: 'id',
      width: '50px',
    },
    {
      header: this.translate.instant('menu.inwardNumber'),
      field: 'inwardNumber',
      width:'115px',
    },
    {
      header: this.translate.instant('dak.title.time'),
      field: 'hearingDetails[0].time',
      formatter: data => `<span>${data.hearingDetails[0].time}`,
    },
    {
      header: this.translate.instant('menu.subject'),
      field: 'subject',
    },
    {
      header: this.translate.instant('menu.dakAssignee'),
      field: 'dakAssignee[0].fullName',
      formatter: data =>
        this.getAssignee(data.dakAssignee?.firstName + ' ' + data.dakAssignee?.lastName),
    },
  ];

  columnsDisplayed: MtxGridColumn[] = [
    {
      header: this.translate.instant('menu.id'),
      field: 'id',
      width: '50px',
    },
    {
      header: this.translate.instant('dak.title.employeeName'),
      field: 'employeeName',
      width: '150px',
    },
    {
      header: this.translate.instant('dak.title.sevenDays'),
      field: 'sevenDays',
      width: '100px',
    },
    {
      header: this.translate.instant('dak.title.eightToFifteen'),
      field: 'eightToFifteen',
      width: '100px',
    },
    {
      header: this.translate.instant('dak.title.fifteenToThirty'),
      field: 'fifteenToThirty',
      width: '100px',
    },
    {
      header: this.translate.instant('dak.title.oneToThreeMonth'),
      field: 'oneToThreeMonth',
      width: '100px',
    },
    {
      header: this.translate.instant('dak.title.moreThanThreeMonth'),
      field: 'moreThanThreeMonth',
      width: '100px',
    },
    {
      header: this.translate.instant('dak.title.total'),
      field: 'total',
      width: '200px',
    },
  ];
  isLoading = true;
  user!: UserDTO;

  empInwardList: EmployeeInwardCounts[] = [];

  constructor(
    public helperService: HelperService,
    private cdr: ChangeDetectorRef,
    private lookupService: LookupService,
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router
  ) {
    this.pageContext.itemsPerPage = ITEMS_PER_PAGE;
    this.pageContext.totalItems = ITEMS_PER_PAGE;
    this.pageContext1.itemsPerPage = ITEMS_PER_PAGE;
    this.pageContext1.totalItems = ITEMS_PER_PAGE;
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.stats = [
      {
        title: this.translate.instant('menu.new'),
        amount: 0,
        progress: {
          value: 50,
        },
        color: 'bg-indigo-500',
        background: 'linear-gradient(to left, #FFBA96, #FF9896 50%, #FE91AB 100%);',
      },
      {
        title: this.translate.instant('menu.pending'),
        amount: 0,
        progress: {
          value: 50,
        },
        color: 'bg-blue-500',
        background: 'linear-gradient(to left, #88C6F8, #55AAEE 50%, #3C9BE7 100%);',
      },
      {
        title: this.translate.instant('menu.awaiting'),
        amount: 0,
        progress: {
          value: 80,
        },
        color: 'bg-green-500',
        background: 'linear-gradient(to left, #7ED8D0, #43D2BF 50%, #3FD8C1 100%);',
      },
      {
        title: this.translate.instant('menu.Hearing'),
        amount: 0,
        progress: {
          value: 121,
        },
        color: 'bg-teal-500',
        background: 'linear-gradient(to left, #E1BEE7, #E040FB 50%, #D500F9 100%);',
      },
      {
        title: this.translate.instant('menu.letterlist'),
        amount: 3342,
        progress: {
          value: 40,
        },
        color: 'bg-teal-500',
        background: 'linear-gradient(to left, #b8ffa7, #85ce7b 50%, #4fbd10 100%);',
      },
    ];

    this.loadTodaysHearingList();
    this.columns;

    //---------New Letter Count---------//
    let search = {
      'currentStatus.equals': 'CREATED',
      'organizationId.equals': this.user.organization?.id,
    };

    this.loadLetterCount(search, 0);

    //---------Pending Letter Count---------//
    search = {
      'currentStatus.equals': 'ASSIGNED',
      'organizationId.equals': this.user.organization?.id,
    };

    this.loadLetterCount(search, 1);

    //---------Awaiting Letter Count---------//
    search = {
      'currentStatus.equals': 'AWAITED',
      'organizationId.equals': this.user.organization?.id,
    };

    this.loadLetterCount(search, 2);

    //---------Hearing Letter Count---------//

    this.loadLetterCount(
      {
        'organizationId.equals': this.user.organization?.id,
        'currentStatus.in': [
          DakMasterDTO.currentStatusEnum.AWAITED_FOR_ORDER,
          DakMasterDTO.currentStatusEnum.HEARING,
        ],
      },
      3
    );

    //---------All Letter Count---------//
    this.lookupService
      .queryletterCount({
        'currentStatus.in': [
          DakMasterDTO.currentStatusEnum.CREATED,
          DakMasterDTO.currentStatusEnum.UPDATED,
          DakMasterDTO.currentStatusEnum.ASSIGNED,
          DakMasterDTO.currentStatusEnum.HEARING,
          DakMasterDTO.currentStatusEnum.AWAITED,
          DakMasterDTO.currentStatusEnum.AWAITED_FOR_ORDER,
          DakMasterDTO.currentStatusEnum.HEARING_AWAITED,
          DakMasterDTO.currentStatusEnum.HEARING_COMPLETED,
          DakMasterDTO.currentStatusEnum.PENDING,
        ],
        'organizationId.equals': this.user.organization?.id,
      })
      .subscribe((req: HttpResponse<CountDTO>) => {
        let allLetters: CountDTO = { count: 0 };
        allLetters = req.body != null ? req.body : allLetters;
        this.stats[4].amount = allLetters.count;

        this.cdr.detectChanges();
      });

    this.loadEmployeeInwardStatus();
  }

  loadLetterCount(search: any, topCardIndex: number) {
    this.lookupService.queryletterCount(search).subscribe((req: HttpResponse<CountDTO>) => {
      let countDTO: CountDTO = { count: 0 };
      countDTO = req.body != null ? req.body : countDTO;
      this.stats[topCardIndex].amount = countDTO.count;

      this.cdr.detectChanges();
    });
  }

  loadEmployeeInwardStatus() {
    this.search = {};
    this.search.page = this.pageContext1.page;
    this.search.size = this.pageContext1.itemsPerPage;
    this.search.sort = this.pageContext1.sort;
    this.search['organizationId.equals'] = this.user.organization?.id;
    this.search['currentStatus.notEquals'] = DakMasterDTO.currentStatusEnum.CLEARED;
    this.lookupService
      .queryEmployeeInwardStatusCount(this.search)
      .subscribe((req: HttpResponse<EmployeeInwardCounts[]>) => {
        const headers = req.headers;
        this.pageContext1.totalItems =
          headers != null ? Number(req.headers.get('X-Total-Count')?.toString()) : 0;
        const temp: EmployeeInwardCounts[] = [];
        this.empInwardList = req.body != null ? req.body : temp;
        this.cdr.detectChanges();
      });
  }

  loadTodaysHearingList() {
    this.isLoading = true;
    this.search.page = this.pageContext.page;
    this.search.size = this.pageContext.itemsPerPage;
    this.search.sort = this.pageContext.sort;
    this.user = this.authService.getUser();
    this.search['status.equals'] = HearingDetailsDTO.stautsEnum.HEARING;
    this.search['organizationId.equals'] = this.user.organization?.id;
    this.lookupService
      .queryTodaysHearing(this.search)
      .subscribe((res: HttpResponse<HearingDetailsDTO[]>) => {
        const headers = res.headers;
        this.pageContext.totalItems =
          headers != null ? Number(headers.get('x-total-count')?.toString()) : 0;
        const temp: HearingDetailsDTO[] = [];
        this.hearingList = res.body != null ? res.body : temp;
      });
  }
  changeSort(e: any) {
    this.pageContext.sort = e.active + ',' + e.direction;
    this.pageContext.page = 0;
    this.loadTodaysHearingList();
  }

  onPageChange(e: any) {
    this.pageContext.page = e.pageIndex;
    this.pageContext.previousPage = e.previousPageIndex;
    this.pageContext.itemsPerPage = e.pageSize;
    this.loadTodaysHearingList();
  }
  onPageChange1(e: any) {
    this.pageContext1.page = e.pageIndex;
    this.pageContext1.previousPage = e.previousPageIndex;
    this.pageContext1.itemsPerPage = e.pageSize;
    this.loadEmployeeInwardStatus();
  }

  changeSort1(e: any) {
    this.pageContext1.sort = e.active + ',' + e.direction;
    this.pageContext1.page = 0;
    this.loadEmployeeInwardStatus();
  }

  searchLetterByCriteria(search: any) {
    var payload = { currentStatus: search };
    this.router.navigateByUrl('/home/letter/list/letter-list', { state: payload });
  }
  getMyIndex(index: number): number {
    if (this.pageContext.page > 0) {
      return this.pageContext.page * this.pageContext.itemsPerPage + index;
    }

    return index;
  }
  getMyIndex1(index: number): number {
    if (this.pageContext1.page > 0) {
      return this.pageContext1.page * this.pageContext1.itemsPerPage + index;
    }

    return index;
  }
  getAssignee(fullName: String): any {
    this.dakAssignee.forEach(element => {
      element.fullName = element?.firstName + ' ' + element?.lastName;
    });
    return fullName;
  }
  downloadReport(isPrint: boolean = false) {
    this.helperService.showReportWait('Report will take time. Please wait!!!');
    this.downloading = true;
    this.searchletter['status.equals'] = HearingDetailsDTO.stautsEnum.HEARING;
    this.searchletter['organizationId.equals'] = this.user.organization?.id;
    this.lookupService
      .todaysHearingReport(this.searchletter)
      .subscribe((res: HttpResponse<any>) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([res.body], { type: 'application/pdf' }));
        a.download = 'TodaysHearing Rep' + moment().format('YYYY-MM-DD') + '.' + this.format;
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
