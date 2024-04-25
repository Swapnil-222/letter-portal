import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslateService } from '@ngx-translate/core';
import { ITEMS_PER_PAGE } from '@shared/constants/pagination.constants';
import { OrganizationDTO } from '@shared/model/organizationDTO';
import { HelperService, LookupService, OperationsService } from '@shared/services';
import { TablesRemoteDataService } from '@shared/services/remote-data.service';
import { Observable } from 'rxjs';
import { CreateOrganizationComponent } from '../create-organization/create-organization.component';

@Component({
  selector: 'app-list-organization',
  templateUrl: './list-organization.component.html',
  styleUrls: ['./list-organization.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TablesRemoteDataService],
})
export class ListOrganizationComponent implements OnInit {
  pageContext = { page: 0, previousPage: 0, itemsPerPage: 0, totalItems: 0, sort: 'id,asc' };
  search: any = {};
  orgList = ['AR', 'DDR'];
  list: OrganizationDTO[] = [];
  columns: MtxGridColumn[] = [
    {
      header: this.translate.instant('menu.id'),
      field: 'id',
      type: 'number',
    },
    {
      header: this.translate.instant('menu.organizationname'),
      field: 'organizationName',
    },
    {
      header: this.translate.instant('menu.organizationtype'),
      field: 'orgnizationType',
    },
    {
      header: this.translate.instant('menu.address'),
      field: 'address',
    },
    {
      header: 'Status',
      field: 'isActivate',
    },
    {
      header: this.translate.instant('menu.description'),
      field: 'description',

    },


    {
      header: this.translate.instant('menu.operation'),
      field: 'operation',
      width: '250px',
      pinned: 'right',
      right: '0px',
      type: 'button',
      buttons: [
        {
          type: 'basic',
          icon: 'visibility',
          tooltip: 'view ',
          click: record => this.onView(record),
        },
        {
          type: 'basic',
          icon: 'delete',
          color: 'warn',
          tooltip: 'delete ',
          click: record => this.onDelete(record),
        },
        {
          type: 'basic',
          icon: 'edit',
          tooltip: 'Edit ',
          click: record => this.onEdit(record),
        },
      ],
    },
  ];

  total = 0;
  isLoading = true;
  isSaving = true;

  query = {
    q: 'user:nzbin',
    sort: 'stars',
    order: 'desc',
    page: 0,
    per_page: 10,
  };

  get params() {
    const p = Object.assign({}, this.query);
    p.page += 1;
    return p;
  }

  constructor(
    private remoteSrv: TablesRemoteDataService,
    private translate: TranslateService,
    private lookupService: LookupService,
    private helperService: HelperService,
    private operationService: OperationsService,
    private router: Router,
    private dialog: MatDialog,
    private mtxDialog: MtxDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.pageContext.itemsPerPage = ITEMS_PER_PAGE;
    this.pageContext.totalItems = ITEMS_PER_PAGE;
  }

  ngOnInit() {
    this.queryData();
    this.columns;
    this.cdr.detectChanges();
  }
  queryData() {
    this.isLoading = true;

    this.search.page = this.pageContext.page;
    this.search.size = this.pageContext.itemsPerPage;
    this.search.sort = this.pageContext.sort;
    this.search['isActivate.in'] = true;

    this.lookupService
      .getOrganizationList(this.search)
      .subscribe((res: HttpResponse<OrganizationDTO[]>) => {
        const headers = res.headers;
        this.pageContext.totalItems =
          headers != null ? Number(headers.get('x-total-count')?.toString()) : 0;
        let temp: OrganizationDTO[] = [];
        this.list = res.body != null ? res.body : temp;
        //this.list = list;
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }
  onSearch(reset: boolean) {
    if (reset) {
      this.search = {};
    }
    this.queryData();
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

  reset() {
    this.query.page = 0;
    this.query.per_page = 10;
  }

  onAdd() {
    this.dialog.open(CreateOrganizationComponent, {
      width: '60%',
    });
  }
  onDelete(record: OrganizationDTO): void {
    this.mtxDialog.confirm(`Do you want to delete?`, '', () => {
      record.isActivate = false;
      this.subscribeToSaveResponse(this.operationService.updateOrganization(record));
    });
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<OrganizationDTO>>): void {
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
      .open(CreateOrganizationComponent, {
        width: '60%',
        data: payload,
      })
      .afterClosed()
      .subscribe(val => {
        if (val === 'update') {
          this.queryData();
        }
      });
  }

  onView(record: any): void {
    var payload = {
      data: record,
      formType: 'View',
    };
    this.dialog.open(CreateOrganizationComponent, {
      width: '60%',
      data: payload,
    });
  }

  previousState() {
  }
  getMyIndex(index: number): number {
    if (this.pageContext.page > 0) {
      return this.pageContext.page * this.pageContext.itemsPerPage + index;
    }

    return index;
  }
}
