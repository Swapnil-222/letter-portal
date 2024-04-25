import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { MatDialog } from '@angular/material/dialog';
import { DakMasterDTO } from '@shared/model/DakMasterDTO';
import { HttpResponse } from '@angular/common/http';
import { HelperService, LookupService } from '@shared/services';
import { AssignedToComponentComponent } from '@shared/components/assigned-to-component/assigned-to-component.component';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@core';
import { ITEMS_PER_PAGE } from '@shared/constants/pagination.constants';
import { UserDTO } from '@shared/model/userDTO';
import { SecurityUserDTO } from '@shared/model/securityUserDTO';
import { TablesRemoteDataService } from '@shared/services/remote-data.service';
import { MatTableDataSource } from '@angular/material/table';
import { Common } from '@shared/utils/common';
import { OrganizationDTO } from '@shared/model/organizationDTO';
import { range } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

export interface PeriodicElement {
  srNo: number;
  inwardNumber: string;
  receviedDate: string;
  outward: number;
  letterDate: string;
  sender: string;
  subject: string;
  status: string;
  comment: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    srNo: 1,
    inwardNumber: 'IN202209550',
    receviedDate: '25/03/2022',
    outward: 12,
    letterDate: '25/03/2022',
    sender: 'मा. सहकार आयुक्त पुणे ',
    subject: 'Regarding agri land',
    status: 'Hearing',
    comment: 'Updated',
  },
];

@Component({
  selector: 'app-inward-register',
  templateUrl: './inward-register.component.html',
  styleUrls: ['./inward-register.component.css'],
})
export class InwardRegisterComponent implements OnInit {
  today = new Date();
  rowStriped = true;
  displayedColumns: string[] = [
    'srNo',
    'inwardNumber',
    'receviedDate',
    'outward',
    'letterDate',
    'sender',
    'subject',
    'status',
    'comment',
  ];
  dataSource = ELEMENT_DATA;

  receivedlessDate: Date;
  receivedGreaterDate: Date;
  pageContext = {
    page: 0,
    previousPage: 0,
    itemsPerPage: 0,
    totalItems: 0,
    sort: ',desc',
  };
  search: any = {};
  currentNav: any;
  user: UserDTO;
  organization!:OrganizationDTO;
  downloading = false;
  myRole!: string;
  userList: SecurityUserDTO[] = [];
  columns: MtxGridColumn[] = [];
  range:any={};
  searchletter: any = {};
  format = 'pdf';
  letterReceivedDate: any = {};
  lesserDate: any;
  greaterDate: any;

  basicColumnm() {
    this.columns = [
      {
        header: this.translate.instant('menu.inwardNumber'),
        field: 'inwardNumber',
        sortable: 'true',
        showExpand: false,
      },
      {
        header: this.translate.instant('menu.letterReceivedDate'),
        field: 'letterReceivedDate',
        formatter: (data: any) => moment(data.letterReceivedDate).format('DD/MM/YYYY'),
      },
      {
        header: this.translate.instant('menu.senderOutward'),
        field: 'senderOutward',
      },
      {
        header: this.translate.instant('menu.letterDate'),
        field: 'letterDate',
        formatter: (data: any) => moment(data.letterDate).format('DD/MM/YYYY'),
      },

      {
        header: this.translate.instant('menu.senderName'),
        field: 'senderName',
      },
      {
        header: this.translate.instant('menu.subject'),
        field: 'subject',
      },
      {
        header: this.translate.instant('menu.currentStatus'),
        field: 'currentStatus',
        formatter: (data: DakMasterDTO) => `${data.currentStatus?.toLocaleLowerCase()}`
      },
    ];
  }
  list: DakMasterDTO[] = [];
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
    private activatedRoute: ActivatedRoute
  ) {
    this.pageContext.itemsPerPage = ITEMS_PER_PAGE;
    this.pageContext.totalItems = ITEMS_PER_PAGE;
  }

  ngOnInit() {
    this.range =  new FormGroup({
      letterGreaterDate : new FormControl(),
      letterlesserDate : new FormControl()
    })
    this.user = this.authService.getUser();
    this.myRole = this.user?.roles![0];

    this.lookupService
      .querySecurityUser(this.search)
      .subscribe((res: HttpResponse<SecurityUserDTO[]>) => {
        const temp: SecurityUserDTO[] = [];
        this.userList = res.body != null ? res.body : temp;
      });
    this.search['currentStatus.in'] = [
      DakMasterDTO.currentStatusEnum.ASSIGNED,
      DakMasterDTO.currentStatusEnum.HEARING,
      DakMasterDTO.currentStatusEnum.AWAITED_FOR_ORDER,
      DakMasterDTO.currentStatusEnum.AWAITED,
      DakMasterDTO.currentStatusEnum.CLEARED,
    ];
    this.search['dispatchedBy.equals'] = this.user.id;
    this.search['organizationId.equals'] = this.user.organization?.id;
    this.basicColumnm();
    this.queryData();
  }

  queryData() {
    this.list = [];
    this.isLoading = true;
    this.search.page = this.pageContext.page;
    this.search.size = this.pageContext.itemsPerPage;
    this.search.sort = this.pageContext.sort;
    this.search['organizationId.equals'] = this.user.organization?.id;
    this.search['dispatchedBy.equals'] = this.user.id;

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
  }

  changeSort(e: any) {
    this.pageContext.sort = e.active + ',' + e.direction;
    this.pageContext.page = 0;
    this.queryData();
  }

  onPageChange(e: any) {
    this.pageContext.page = e.pageIndex;
    this.pageContext.previousPage = e.previousPageIndex;
    this.pageContext.itemsPerPage = e.pageSize;
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

  onSearch(reset: boolean){
    this.greaterDate = JSON.stringify(this.range.letterGreaterDate).substring(1, 25);
    this.lesserDate = JSON.stringify(this.range.letterlesserDate).substring(1, 25);
    this.search['letterReceivedDate.greaterThanOrEqual'] = this.greaterDate;
    this.search['letterReceivedDate.lessThanOrEqual'] = this.lesserDate;

    if (reset) {
      this.search = {};
      this.range.letterGreaterDate={};
      this.range.letterlesserDate={};
      this.range.reset();
    }
    this.queryData();
  }

  downloadReport(isPrint: boolean = false) {
    if (
      this.greaterDate == null ||
      this.lesserDate == null ||
      this.greaterDate == 'ull' ||
      this.lesserDate == 'ull'
    ) {
      this.helperService.showReportError('Failed please select date range first.');
    } else if (this.range.reset()) {
      this.helperService.showReportError('Failed please select date range first.');
    } else if (this.greaterDate != null || this.lesserDate != null) {
      this.helperService.showReportWait('Report will take time. Please wait!!!');
    this.downloading = true;
    this.searchletter['dispatchedBy.equals'] = this.user.id;
    this.searchletter['organizationId.equals'] = this.user.organization?.id;
    this.searchletter['letterReceivedDate.greaterThanOrEqual'] = this.greaterDate;
    this.searchletter['letterReceivedDate.lessThanOrEqual'] = this.lesserDate;
    this.lookupService.downloadNondwahiReport(this.searchletter).subscribe((res: HttpResponse<any>) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([res.body], { type: 'application/pdf' }));
      a.download = 'Inward_Register_Report'+ '_' + moment().format('YYYY-MM-DD') + '.' + this.format;
      if (isPrint) {
        window.open(a.href);
      } else {
        document.body.appendChild(a);
        a.click();
      }
      this.downloading = false;
    });
  }
}

  getAssignee(dakAssignee: any): void {
    var assigneeNAme;
    this.userList.forEach(element => {
      if ((element.id = dakAssignee)) assigneeNAme = element.firstName;
    });
    return assigneeNAme;
  }
  openDialog() {}
}
