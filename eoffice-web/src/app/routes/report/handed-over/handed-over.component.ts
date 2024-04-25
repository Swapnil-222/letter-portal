import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslateService } from '@ngx-translate/core';
import { DakJourneyDTO } from '@shared/model/DakJourneyDTO';
import { DakMasterDTO } from '@shared/model/DakMasterDTO';
import { HelperService, LookupService } from '@shared/services';
import * as moment from 'moment';
import { HttpResponse } from '@angular/common/http';
import { DatePipe, formatDate } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SecurityUserDTO } from '@shared/model/securityUserDTO';
import { concat, map } from 'rxjs';
import { DakAssigneeDTO } from '@shared/model/dakAssigneeDTO';
import { UserDTO } from '@shared/model/userDTO';
@Component({
  selector: 'app-handed-over',
  templateUrl: './handed-over.component.html',
  styleUrls: ['./handed-over.component.css'],
  providers: [DatePipe],
})
export class HandedOverComponent implements OnInit {
  list: DakMasterDTO[] = [];
  securitylist: SecurityUserDTO[] = [];
  data: any;
  user: UserDTO;
  downloading = false;
  searchletter: any = {};
  format = 'pdf';
  letterList: DakMasterDTO[] = [];
  pageContext = {
    page: 0,
    previousPage: 0,
    itemsPerPage: 0,
    totalItems: 0,
    sort: 'id,asc',
  };
  search: any = {};
  isLoading = true;
  element: DakMasterDTO;
  columns: MtxGridColumn[] = [
    {
      header: this.translate.instant('menu.id'),
      field: 'id',
      width: '50px',
    },
    {
      header: this.translate.instant('menu.employeename'),
      field: 'employeeName',
      width: '150px',
    },
    {
      header: this.translate.instant('menu.inwardNumberWiseLetters'),
      field: 'inwardNumberList',
      width: '150px',
    },
    {
      header: this.translate.instant('menu.signature'),
      field: 'signature',
      width: '50px',
    },
  ];
  asignedDate: string;

  constructor(
    public datepipe: DatePipe,
    public lookupService: LookupService,
    public helperService: HelperService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public dialog: MatDialog,
    private translate: TranslateService,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authService.user().subscribe(user => (this.user = user));
    this.queryData();
  }
  queryData() {
    this.list = [];
    this.isLoading = true;
    this.search.page = this.pageContext.page;
    this.search.size = this.pageContext.itemsPerPage;
    this.search.sort = this.pageContext.sort;

    this.lookupService.querySecurityUser().subscribe((res: HttpResponse<SecurityUserDTO[]>) => {
      const security: SecurityUserDTO[] = [];
      this.securitylist = res.body != null ? res.body : security;
      this.isLoading = false;
      this.cdr.detectChanges();
    });

    let formatterDateStartDate =
      formatDate(this.asignedDate, 'yyyy-MM-dd', 'en-US') + 'T00:00:00.009Z';
    this.search['assignedDate.greaterThanOrEqual'] = formatterDateStartDate;
    let formatterDateEndDate =
      formatDate(this.asignedDate, 'yyyy-MM-dd', 'en-US') + 'T23:59:59.009Z';
    this.search['letterReceivedDate.lessThan'] = formatterDateEndDate;
    this.search['dakAssignedFrom.equals'] = this.user.id;
    this.search['organizationId.equals'] = this.user.organization?.id;
    let formatterDate = formatDate(this.asignedDate, 'yyyy-MM-dd', 'en-US');
    console.log;
    this.lookupService
      .queryHandedOverRerport(this.search)
      .subscribe((res: HttpResponse<DakMasterDTO[]>) => {
        const headers = res.headers;
        this.pageContext.totalItems =
          headers != null ? Number(headers.get('x-total-count')?.toString()) : 0;
        const temp: DakMasterDTO[] = [];
        this.list = res.body != null ? res.body : temp;
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
  onSearch(reset: boolean) {
    this.search['dakAssignedFrom.equals'] = this.user.id;
    this.search['organizationId.equals'] = this.user.organization?.id;

    if (reset) {
      this.search = {};
      this.asignedDate ='';
    }
    this.queryData();
  }
  getMyIndex(index: number): number {
    if (this.pageContext.page > 0) {
      return this.pageContext.page * this.pageContext.itemsPerPage + index;
    }

    return index;
  }
  getPatientName(fullName: String): any {
    this.list.forEach(element => {
      element.fullName = element.dakAssignee?.firstName + ' ' + element.dakAssignee?.lastName;
      // if(element.dakAssignee?.firstName && element.dakAssignee.lastName == undefined){
      //   return element.dakAssignee.firstName;
      // }
    });
    return fullName;
  }
  openDialog() {}
  downloadReport(isPrint: boolean = false) {
      if(this.asignedDate == null || this.asignedDate == undefined || this.asignedDate == '' ){
        this.helperService.showReportError('Failed please select date range first.');
      }else{
    // if(this.asignedDate == undefined ||  this.asignedDate == null ){
    //   this.helperService.showReportError('Fail please select date range first.');
    // }else{
      this.helperService.showReportWait('Report will take time. Please wait!!!');
      this.downloading = true;
      this.searchletter['dakAssignedFrom.equals'] = this.user.id;
      this.searchletter['organizationId.equals'] = this.user.organization?.id;
      let formatterDateStartDate =
        formatDate(this.asignedDate, 'yyyy-MM-dd', 'en-US') + 'T00:00:00.009Z';
      this.searchletter['assignedDate.greaterThanOrEqual'] = formatterDateStartDate;
      let formatterDateEndDate =
        formatDate(this.asignedDate, 'yyyy-MM-dd', 'en-US') + 'T23:59:59.009Z';
      this.searchletter['letterReceivedDate.lessThan'] = formatterDateEndDate;

      let formatterDate = formatDate(this.asignedDate, 'yyyy-MM-dd', 'en-US');
      //this.searchletter['quote_id'] = this.warehouseDTO.id;
      this.lookupService
        .downloadHandedOverReport(this.searchletter, formatterDateStartDate)
        .subscribe((res: HttpResponse<any>) => {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(new Blob([res.body], { type: 'application/pdf' }));
          a.download = 'Handedover_report' + moment().format('YYYY-MM-DD') + '.' + this.format;
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
}
