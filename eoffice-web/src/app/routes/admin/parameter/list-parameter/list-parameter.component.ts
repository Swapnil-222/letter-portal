import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ITEMS_PER_PAGE } from '@shared/constants/pagination.constants';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslateService } from '@ngx-translate/core';
import { ParamterLookupDTO } from '@shared/model/parameterLookupDTO';
import { HelperService, LookupService, OperationsService } from '@shared/services';
import { TablesRemoteDataService } from '@shared/services/remote-data.service';
import { CreateParameterComponent } from '../create-parameter/create-parameter.component';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { UserDTO } from '@shared/model/userDTO';
import { AuthService } from '@core';

@Component({
  selector: 'app-list-parameter',
  templateUrl: './list-parameter.component.html',
  styleUrls: ['./list-parameter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TablesRemoteDataService],
})
export class ListParameterComponent implements OnInit {
  pageContext = { page: 0, previousPage: 0, itemsPerPage: 0, totalItems: 0, sort: 'id,asc' };
  search: any = {};
  indata: any;
  user!: UserDTO;
  list: ParamterLookupDTO[] = [];
  columns: MtxGridColumn[] = [
    {
      header: this.translate.instant('menu.id'),
      field: 'id',
      type: 'number',
    },

    {
      header: this.translate.instant('menu.parameter'),
      field: 'parameterName',
    },
    {
      header: this.translate.instant('dak.title.type'),
      field: 'type',
    },
  ];

  total = 0;
  isLoading = true;
  isSaving = true;

  query = {
    q: '',
    sort: '',
    order: '',
    page: 0,
    per_page: 5,
  };

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private lookupService: LookupService,
    private location: Location,
    private dialog: MatDialog,
    private router: Router,
    private helperService: HelperService,
    private mtxDialog: MtxDialog,
    private operationService: OperationsService
  ) {
    this.pageContext.itemsPerPage = ITEMS_PER_PAGE;
    this.pageContext.totalItems = ITEMS_PER_PAGE;
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.queryData();

    if (this.user.roles![0] != 'ROLE_ORG_ADMIN') {
      this.operationsColumns();
    }
  }
  queryData() {
    this.isLoading = true;
    this.search['organizationId.equals'] = '1';
    this.search.page = this.pageContext.page;
    this.search.size = this.pageContext.itemsPerPage;
    this.search.sort = this.pageContext.sort;

    this.lookupService
      .queryParameterList(this.search)
      .subscribe((res: HttpResponse<ParamterLookupDTO[]>) => {
        const headers = res.headers;
        this.pageContext.totalItems =
          headers != null ? Number(headers.get('x-total-count')?.toString()) : 0;
        let temp: ParamterLookupDTO[] = [];
        this.list = res.body != null ? res.body : temp;
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }
  onAdd() {
    this.dialog
      .open(CreateParameterComponent, {
        width: '50%',
      })
      .afterClosed()
      .subscribe(val => {
        this.queryData();
      });
  }
  onDelete(record: ParamterLookupDTO): void {
    this.mtxDialog.confirm(`Do you want to delete?`, '', () => {
      this.subscribeToSaveResponse(this.operationService.deleteParameter(record));
    });
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<ParamterLookupDTO>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }
  protected onSaveSuccess(): void {
    this.helperService.showSuccess('Success');
    this.queryData();
  }

  onSaveError(): void {
    this.helperService.showError('Fail');
    this.queryData();
  }

  onEdit(record: any): void {
    var payload = {
      data: record,
      formType: 'Update',
    };
    this.dialog
      .open(CreateParameterComponent, {
        width: '50%',
        data: payload,
      })
      .afterClosed()
      .subscribe(val => {
        this.queryData();
      });
  }
  onSearch(reset: boolean) {
    if (reset) {
      this.search = {};
    }
    this.queryData();
  }
  previousState() {
    this.router.navigateByUrl('home/dashboard');
    this.location.back();
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
  getMyIndex(index: number): number {
    if (this.pageContext.page > 0) {
      return this.pageContext.page * this.pageContext.itemsPerPage + index;
    }

    return index;
  }
  operationsColumns() {
    this.columns.push({
      header: this.translate.instant('menu.operation'),
      field: 'operation',
      width: '250px',
      pinned: 'right',
      right: '0px',
      type: 'button',
      buttons: [
        {
          type: 'basic',
          icon: 'edit',
          tooltip: 'Edit ',
          click: record => this.onEdit(record),
        },
        {
          type: 'basic',
          icon: 'delete',
          color: 'warn',
          tooltip: 'delete ',
          click: record => this.onDelete(record),
        },
      ],
    });
  }
}
