import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core';
import { ITEMS_PER_PAGE } from '@shared/constants/pagination.constants';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslateService } from '@ngx-translate/core';
import { SecurityUserDTO } from '@shared/model/securityUserDTO';
import { HelperService, LookupService, OperationsService } from '@shared/services';
import { TablesRemoteDataService } from '@shared/services/remote-data.service';
import { UserDTO } from '@shared/model/userDTO';
import { Observable } from 'rxjs';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { EventQueueService } from '@shared/services/event_queue_service.service';
import { AppEventType } from '@shared/constants/app_event';
import { ParamterLookupDTO } from '@shared/model/parameterLookupDTO';
import { Common } from '@shared/utils/common';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TablesRemoteDataService],
})
export class ListUserComponent implements OnInit {
  pageContext = { page: 0, previousPage: 0, itemsPerPage: 0, totalItems: 0, sort: 'id,asc' };
  search: any = {};
  list: SecurityUserDTO[] = [];
  isLoading = true;
  isSaving = true;
  user!: UserDTO;
  parameterDesList!: ParamterLookupDTO[];
  selectedRole: any = '';

  constructor(
    private lookupService: LookupService,
    private router: Router,
    private mtxDialog: MtxDialog,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private authService: AuthService,
    private helperService: HelperService,
    private operationService: OperationsService,
    private eventQueue: EventQueueService
  ) {
    this.pageContext.itemsPerPage = ITEMS_PER_PAGE;
    this.pageContext.totalItems = ITEMS_PER_PAGE;
    this.user = this.authService.getUser();
  }

  ngOnInit() {
    this.eventQueue.on(AppEventType.LETTER_STATE_CHANGE).subscribe(event => this.handleEvent());
    this.lookupService
    .queryParameterList(this.search)
    .subscribe((res: HttpResponse<ParamterLookupDTO[]>) => {
      let temp: ParamterLookupDTO[] = [];
      this.parameterDesList = res.body != null ? res.body : temp;
      this.isLoading = false;
    });
    this.search['organizationId.equals'] = this.user.organization?.id;
    Common.removeEmptyFields(this.search);
    this.cdr.detectChanges();
    this.queryData();
    this.columns;
    this.cdr.detectChanges();
  }
  handleEvent(): void {
    this.search = {};
    this.queryData();
  }
  onSearch(reset: boolean) {
    if (reset) {
      this.search = {};
      this.selectedRole = '';
    }
    this.queryData();
  }
  queryData() {
    this.list = [];

    this.isLoading = true;

    this.search.page = this.pageContext.page;
    this.search.size = this.pageContext.itemsPerPage;
    this.search.sort = this.pageContext.sort;

    if (this.user.roles![0] != 'ROLE_SUPER_ADMIN' && this.user.organization != null) {
      this.search['organizationId.equals'] = this.user.organization?.id;
    } else {
      this.search['securityRoleId.equals'] = 2;
    }
    this.search['designation.contains'] = this.selectedRole;
    Common.removeEmptyFields(this.search);
    this.lookupService
      .querySecurityUser(this.search)
      .subscribe((res: HttpResponse<SecurityUserDTO[]>) => {
        const headers = res.headers;
        this.pageContext.totalItems =
          headers != null ? Number(headers.get('x-total-count')?.toString()) : 0;
        let temp: SecurityUserDTO[] = [];
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

  previousState() {
    this.router.navigateByUrl('home/dashboard');
  }

  onAdd() {
    this.router.navigateByUrl('/home/admin/user/create');
  }
  onEdit(record: SecurityUserDTO): void {
    this.router.navigateByUrl('/home/admin/user/' + 'edit/' + record.id);
  }
  onView(record: any): void {
    this.router.navigateByUrl('/home/admin/user/' + 'read/' + record.id);
  }

  onDelete(record: SecurityUserDTO): void {
    if (record.securityRoles![0] == 'ROLE_ORG_ADMIN') {
      this.helperService.showError('You can not perform this operation on this user!!');
    } else {
      this.mtxDialog.confirm(`Do you want to delete?`, '', () => {
        this.subscribeToSaveResponse(this.operationService.deleteSecurityUser(record));
      });
    }
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<SecurityUserDTO>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }
  protected onSaveSuccess(): void {
    this.helperService.showSuccess('Success');
    this.queryData();
  }
  getMyIndex(index: number): number {
    if (this.pageContext.page > 0) {
      return this.pageContext.page * this.pageContext.itemsPerPage + index;
    }

    return index;
  }
  onSaveError(): void {
    this.helperService.showError('Fail');
    this.queryData();
  }

  columns: MtxGridColumn[] = [
    {
      header: this.translate.instant('menu.id'),
      field: 'id',
    },
    {
      header: this.translate.instant('menu.firstName'),
      field: 'firstName',
    },
    {
      header: this.translate.instant('menu.lastName'),
      field: 'lastName',
    },
    {
      header: this.translate.instant('menu.username'),
      field: 'username',
    },
    {
      header: this.translate.instant('menu.designation'),
      field: 'designation',
    },
    {
      header: this.translate.instant('menu.organizationname'),
      field: 'organization.organizationName',
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
          iif: (data: SecurityUserDTO) =>
            this.user.roles![0] != 'ROLE_ORG_ADMIN' ||
            data.securityRoles![0].roleName != 'ROLE_ORG_ADMIN',
        },
        {
          type: 'basic',
          icon: 'edit',
          tooltip: 'Edit ',
          click: record => this.onEdit(record),
          iif: (data: SecurityUserDTO) =>
            this.user.roles![0] != 'ROLE_ORG_ADMIN' ||
            data.securityRoles![0].roleName != 'ROLE_ORG_ADMIN',
        },
      ],
    },
  ];
}
