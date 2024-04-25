import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslateService } from '@ngx-translate/core';
import { ITEMS_PER_PAGE } from '@shared/constants/pagination.constants';
import { DakMasterDTO } from '@shared/model/DakMasterDTO';
import { TablesRemoteDataService } from '@shared/services/remote-data.service';
import { SecurityUserDTO } from '@shared/model/securityUserDTO';
import * as moment from 'moment';
import { DatePipe, formatDate } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { HelperService, LookupService } from '@shared/services';
import { UserDTO } from '@shared/model/userDTO';
import { AuthService } from '@core';
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

];

@Component({
  selector: 'app-nondwahi',
  templateUrl: './nondwahi.component.html',
  styleUrls: ['./nondwahi.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TablesRemoteDataService],
})
export class NondwahiComponent implements OnInit {
  today = new Date();
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
  //dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  search: any = {};
  pageContext = { page: 0, previousPage: 0, itemsPerPage: 0, totalItems: 0, sort: 'id,asc' };
  list: DakMasterDTO[] = [];
  total = 0;
  currentNav: any;
  user: UserDTO;
  isLoading = true;
  downloading = false;
  format = 'pdf';
  isSaving = true;
  searchletter: any = {};
  letterReceivedDate: any = {};
  range: any = {};
  query = {
    q: '',
    sort: '',
    order: '',
    page: 0,
    per_page: 10,
  };
  userList: SecurityUserDTO[] = [];

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
      header: this.translate.instant('menu.comment'),
      field: 'comment',
    },
  ];
  greaterDate: string;
  lesserDate: string;

  constructor(
    public helperService: HelperService,
    private translate: TranslateService,
    public lookupService: LookupService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.pageContext.itemsPerPage = ITEMS_PER_PAGE;
    this.pageContext.totalItems = ITEMS_PER_PAGE;
  }

  ngOnInit(): void {
    this.range = new FormGroup({
      letterGreaterDate: new FormControl(),
      letterlesserDate: new FormControl(),
    });
    this.user = this.authService.getUser();
    this.queryData();
    if (!this.coloumnExists()) {
      this.columns.push({
        header: this.translate.instant('menu.currentStatus'),
        field: 'currentStatus',
      });
    }
  }
  queryData() {
    this.list = [];
    this.isLoading = true;
    this.search.page = this.pageContext.page;
    this.search.size = this.pageContext.itemsPerPage;
    this.search.sort = this.pageContext.sort;
    this.search['organizationId.equals'] = this.user.organization?.id;
    this.search['currentStatus.in'] = [
      DakMasterDTO.currentStatusEnum.ASSIGNED,
      DakMasterDTO.currentStatusEnum.HEARING,
      DakMasterDTO.currentStatusEnum.AWAITED,
      DakMasterDTO.currentStatusEnum.HEARING_AWAITED,
      DakMasterDTO.currentStatusEnum.HEARING_COMPLETED,
      DakMasterDTO.currentStatusEnum.PENDING,
      DakMasterDTO.currentStatusEnum.AWAITED_FOR_ORDER,
      DakMasterDTO.currentStatusEnum.CLEARED,
    ];

    this.search['dakAssignee.equals'] = this.user.id;
    this.lookupService
      .queryForNondwahiList(this.search)
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
  serchDate() {
    this.greaterDate = JSON.stringify(this.range.letterGreaterDate).substring(1, 25);
    this.lesserDate = JSON.stringify(this.range.letterlesserDate).substring(1, 25);
    this.search['letterReceivedDate.greaterThanOrEqual'] = this.greaterDate;
    this.search['letterReceivedDate.lessThanOrEqual'] = this.lesserDate;
  }
  onSearch(reset: boolean) {
    if (reset) {
      this.search = {};
      this.range.letterGreaterDate = {};
      this.range.letterlesserDate = {};
      this.range.reset();
    }
    this.queryData();
    this.serchDate();
  }
  openDialog() {}
  downloadReport(isPrint: boolean = false) {
    if (
      this.greaterDate == undefined ||
      this.lesserDate == undefined ||
      this.greaterDate == null ||
      this.lesserDate == null ||
      this.greaterDate == 'ull' ||
      this.lesserDate == 'ull'
    ) {
      this.helperService.showReportError('Failed please select date range first.');
    } else if (this.greaterDate != null || this.lesserDate != null) {
      this.helperService.showReportWait('Report will take time. Please wait!!!');
      this.downloading = true;
      this.searchletter['dakAssignee.equals'] = this.user.id;
      this.searchletter['organizationId.equals'] = this.user.organization?.id;
      this.searchletter['letterReceivedDate.greaterThanOrEqual'] = this.greaterDate;
      this.searchletter['letterReceivedDate.lessThanOrEqual'] = this.lesserDate;
      this.lookupService
        .downloadNondwahiReport(this.searchletter)
        .subscribe((res: HttpResponse<any>) => {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(new Blob([res.body], { type: 'application/pdf' }));
          a.download = 'noandwahi_report' + moment().format('YYYY-MM-DD') + '.' + this.format;
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
  getAssignee(dakAssignee: any): void {
    var assigneeNAme;
    this.userList.forEach(element => {
      if ((element.id = dakAssignee)) assigneeNAme = element.firstName;
    });
    return assigneeNAme;
  }
  changeSort(e: any) {
    this.pageContext.sort = e.active + ',' + e.direction;
    this.pageContext.page = 0;
    //this.queryData();
  }

  onPageChange(e: any) {
    this.pageContext.page = e.pageIndex;
    this.pageContext.previousPage = e.previousPageIndex;
    this.pageContext.itemsPerPage = e.pageSize;
    //this.queryData();
  }
  coloumnExists() {
    var i;
    for (i = 0; i < this.columns.length; i++) {
      if (this.columns[i].field == 'currentStatus') {
        return true;
      }
    }
    return false;
  }
  getMyIndex(index: number): number {
    if (this.pageContext.page > 0) {
      return this.pageContext.page * this.pageContext.itemsPerPage + index;
    }

    return index;
  }
}
