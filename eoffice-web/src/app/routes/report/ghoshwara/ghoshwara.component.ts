import { DatePipe, formatDate } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '@core/authentication';
import * as moment from 'moment';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { GhoshwaraDTO } from '@shared/model/GhoshwaraDTO';
import { UserDTO } from '@shared/model/userDTO';
import { HelperService, LookupService } from '@shared/services';

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
  selector: 'app-ghoshwara',
  templateUrl: './ghoshwara.component.html',
  styleUrls: ['./ghoshwara.component.css'],
})
export class GhoshwaraComponent implements OnInit {
  startdateofweek: any;
  enddateofweek: any;
  date = new Date();
  model: any = {};
  list: GhoshwaraDTO[] = [];
  user: UserDTO;
  columns: MtxGridColumn[] = [];
  VOForm!: FormGroup;
  tempDate: string;
  isLoading: true;
  range: any = {};
  downloading = false;
  searchletter: any = {};
  search: any = {};
  format = 'pdf';
  lastModified: string;
  dataSource = ELEMENT_DATA;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  pageContext = { page: 0, previousPage: 0, itemsPerPage: 0, totalItems: 0, sort: 'id,asc' };
  totalweekpending: number;
  constructor(
    public lookupService: LookupService,
    private _formBuilder: FormBuilder,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    public datepipe: DatePipe,
    public helperService: HelperService
  ) {}

  ngOnInit(): void {
    this.model.startdate = new Date();
    this.auth.user().subscribe(user => (this.user = user));
    this.queryData();
    this.addBasicColumns();
    this.VOForm = this._formBuilder.group({
      VORows: this._formBuilder.array([]),
    });

    let getdate = this.datepipe.transform(this.model.startdate, 'yyyy,M,d');
    function startOfWeek(date) {
      var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
      return new Date(date.setDate(diff));
    }
    function endofweek(date) {
      var lastday = date.getDate() - (date.getDay() - 1) + 6;
      return new Date(date.setDate(lastday));
    }
    var dt = new Date();
    this.startdateofweek = this.datepipe.transform(startOfWeek(dt), ' MMMM d, y');
    this.enddateofweek = this.datepipe.transform(endofweek(dt), ' MMMM d, y');
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

  queryData() {
    this.isLoading = true;
    this.search.page = this.pageContext.page;
    this.search.size = this.pageContext.itemsPerPage;
    this.search.sort = this.pageContext.sort;
    this.search['securityUserId.equals'] = this.user.id;
    this.lookupService.queryGoshwara(this.search).subscribe((res: HttpResponse<GhoshwaraDTO[]>) => {
      const temp: GhoshwaraDTO[] = [];
      this.list = res.body != null ? res.body : temp;
      this.cdr.detectChanges();
    });
  }

  addBasicColumns() {
    this.columns = [
      {
        header: 'Employee Name',
        field: 'Name',

        minWidth: 100,
      },
      {
        header: 'Register Type',
        field: 'registerType',

        minWidth: 100,
      },
      {
        header: 'Current Week Inwards',
        field: 'currentWeekInwards',

        minWidth: 100,
      },
      {
        header: 'Total',
        field: 'total',

        minWidth: 100,
      },
      {
        header: 'Self Generated',
        field: 'selfGenerated',

        minWidth: 100,
      },
      {
        header: 'Current Week Cleared',
        field: 'currentWeekCleared',

        minWidth: 100,
      },
      {
        header: 'Weekly Pendings',
        field: 'weeklyPendings',

        minWidth: 100,
      },
      {
        header: '1st Week',
        field: 'firstWeek',

        minWidth: 100,
      },
      {
        header: '2nd Week',
        field: 'secondWeek',

        minWidth: 100,
      },
      {
        header: '3rd Week',
        field: 'thirdWeek',

        minWidth: 100,
      },
      {
        header: '1st Month',
        field: 'firstMonth',

        minWidth: 100,
      },
      {
        header: '2nd Month',
        field: 'secondMonth',

        minWidth: 100,
      },
      {
        header: '3rd Month',
        field: 'thirdMonth',

        minWidth: 100,
      },
      {
        header: 'Within 6 Months',
        field: 'withinSixMonths',

        minWidth: 100,
      },
    ];
  }
  openDialog() {}
  getDate() {
    let localDate = new Date();
    this.tempDate = JSON.stringify(localDate).substring(1, 25);
    return this.tempDate;
  }
  getWorkdiscription(number1: number = 0) {
    return number1;
  }

  getAddition(number1: number = 0, number2: number = 0) {
    return number1 + number2;
  }
  downloadReport(isPrint: boolean = false) {
    this.helperService.showReportWait('Report will take time. Please wait!!!');
    this.downloading = true;
    this.searchletter['securityUserId.equals'] = this.user.id;
    this.lookupService
      .downloadGhoshwaraReport(this.searchletter)
      .subscribe((res: HttpResponse<any>) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([res.body], { type: 'application/pdf' }));
        a.download = 'Ghoshwara_Report' + '_' + moment().format('YYYY-MM-DD') + '.' + this.format;

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
