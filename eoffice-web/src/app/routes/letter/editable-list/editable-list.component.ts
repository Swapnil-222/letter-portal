import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core';
import { TranslateService } from '@ngx-translate/core';
import { AppEventType } from '@shared/constants/app_event';
import { AppEvent } from '@shared/model/app_event_class';
import { DakMasterDTO } from '@shared/model/DakMasterDTO';
import { SecurityUserDTO } from '@shared/model/securityUserDTO';
import { UserDTO } from '@shared/model/userDTO';
import { HelperService, LookupService, OperationsService } from '@shared/services';
import { EventQueueService } from '@shared/services/event_queue_service.service';
import { Observable } from 'rxjs';
import { ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ITEMS_PER_PAGE } from '@shared/constants/pagination.constants';
import { MatSort } from '@angular/material/sort';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-editable-list',
  templateUrl: './editable-list.component.html',
  styleUrls: ['./editable-list.component.css'],
})
export class EditableListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  pageContext = {
    page: 0,
    previousPage: 0,
    itemsPerPage: 0,
    totalItems: 0,
    sort: 'id,asc',
  };
  displayedColumns: string[] = [
    'srnumber',
    'inwardNumber',
    'senderOutward',
    'letterDate',
    'letterReceivedDate',
    'senderName',
    'subject',
    'dakAssignee',
    'action',
  ];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatTable) table!: MatTable<any>;
  isLoading = true;
  pageNumber: number = 1;
  VOForm!: FormGroup;
  isEditableNew: boolean = true;
  search: any = {};
  list: DakMasterDTO[] = [];
  @Input() criteria!: any;
  markerList!: SecurityUserDTO[];
  assignedTo: number | undefined;
  selectedMarker!: number;
  details!: DakMasterDTO;
  isSaving!: boolean;
  user!: UserDTO;
  currentNav: any;
  selectedIndex: number;
  today = new Date();
  myRole!: string;
  filteredInverd: any;
  totalcount: number | undefined;
  constructor(
    private fb: FormBuilder,
    private _formBuilder: FormBuilder,
    private lookupService: LookupService,
    private cdr: ChangeDetectorRef,
    private operationService: OperationsService,
    private helperService: HelperService,
    private authService: AuthService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventQueue: EventQueueService
  ) {
    this.pageContext.itemsPerPage = ITEMS_PER_PAGE;
    // this.pageContext.totalItems = ITEMS_PER_PAGE;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.activatedRoute.url.subscribe(route => {
      this.currentNav = route;
    });
    this.VOForm = this._formBuilder.group({
      VORows: this._formBuilder.array([]),
    });

    this.isLoading = false;

    this.isLoading = true;

    if (this.user.roles![0] == 'ROLE_CLERK') {
      this.search = {};

      this.search['currentStatus.in'] = [
        DakMasterDTO.currentStatusEnum.CREATED,
        DakMasterDTO.currentStatusEnum.UPDATED,
      ];
      this.search['organizationId.equals'] = this.user.organization?.id;
      this.search['securityRoleId.equals'] = 5;
      this.search['activated.in'] = false;
    } else if (this.user.roles![0] == 'ROLE_MARKER') {
      this.search = {};

      if (this.currentNav[0].path == 'new-letters-marker') {
        this.search['currentStatus.equals'] = DakMasterDTO.currentStatusEnum.ASSIGNED;
        this.search['dakAssignee.equals'] = this.user.id;
        this.search['organizationId.equals'] = this.user.organization?.id;
        this.search['securityRoleId.equals'] = 6;
      }
    } else if (this.user.roles![0] == 'ROLE_EMP') {
      this.search = {};
      this.search['currentStatus.in'] = this.search['currentStatus.in'];
      this.search['dakAssignee.equals'] = this.user.id;
    }

    this.search['organizationId.equals'] = this.search['organizationId.equals'];
    this.isLoading = true;
    this.myRole = this.user?.roles![0];
    this.lookupService
      .queryMarkerList(this.search)
      .subscribe((res: HttpResponse<SecurityUserDTO[]>) => {
        const headers = res.headers;
        this.pageContext.totalItems =
          headers != null ? Number(headers.get('x-total-count')?.toString()) : 0;
        const temp: SecurityUserDTO[] = [];
        this.markerList = res.body != null ? res.body : temp;
        this.isLoading = false;
      });

    this.queryData();
  }
  bindDataWithTable() {
    this.VOForm = this.fb.group({
      VORows: this.fb.array(
        this.dataSource.data.map(val =>
          this.fb.group({
            srnumber: new FormControl(val.id),
            id: new FormControl(val.id),
            inwardNumber: new FormControl(val.inwardNumber),
            senderOutward: new FormControl(val.senderOutward),
            letterDate: new FormControl(val.letterDate),
            letterReceivedDate: new FormControl(val.letterReceivedDate),
            senderName: new FormControl(val.senderName),
            subject: new FormControl(val.subject),
            action: new FormControl('existingRecord'),
            isEditable: new FormControl(true),
            isNewRow: new FormControl(false),
            contactNumber: new FormControl(val.contactNumber),
            senderAddress: new FormControl(val.senderAddress),
            senderEmail: new FormControl(val.senderEmail),
            currentStatus: new FormControl(DakMasterDTO.currentStatusEnum.ASSIGNED),
            letterStatus: new FormControl(val.letterStatus),
            awaitReason: new FormControl(val.awaitReason),
            dispatchDate: new FormControl(val.dispatchDate),
            createdBy: new FormControl(val.createdBy),
            createdOn: new FormControl(val.createdOn),
            letterType: new FormControl(val.letterType),
            isResponseReceived: new FormControl(val.isResponseReceived),
            assignedDate: new FormControl(val.assignedDate),
            lastModified: new FormControl(val.lastModified),
            lastModifiedBy: new FormControl(val.lastModifiedBy),
            dakAssignedFrom: new FormControl({ id: this.user.id }),
            dakAssignee: new FormControl(val.dakAssignee),
            dispatchedBy: new FormControl(
              this.myRole == 'ROLE_CLERK' ? this.user : val.dispatchedBy
            ),
            outwardNumber: new FormControl(val.outwardNumber),
            taluka: new FormControl(val.taluka),
            organization: new FormControl(this.user.organization),
            securityUsers: new FormControl(this.user),
          })
        )
      ),
    });
    this.isLoading = false;
    this.dataSource = new MatTableDataSource((this.VOForm.get('VORows') as FormArray).controls);
  }

  EditSVO(VOFormElement: any, i: any) {
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(false);
  }
  edit(VOForm: any, i: any) {
    console.log('VO form +++' + JSON.stringify(VOForm.get('VORows').at(i).value.id));
    this.router.navigateByUrl(
      '/home/letter/editLetter/ ' + parseInt(VOForm.get('VORows').at(i).value.id)
    );
  }
  SaveVO(VOFormElement: any, i: any) {
    var rowData = VOFormElement.get('VORows').at(i).value;
    if (this.myRole == 'ROLE_MARKER') {
      rowData.assignedDate = formatDate(this.today, 'yyyy-MM-dd', 'en-US') + 'T00:00:00.009Z';
    }
    this.subscribeToSaveResponse(this.operationService.updateLetter(rowData));
  }

  handleDisabled(id: number) {
    if (this.assignedTo != null && id == this.selectedIndex) {
      return false;
    }
    return true;
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<DakMasterDTO>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }
  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.helperService.showSuccess('Success');
    this.queryData();
    this.eventQueue.dispatch(new AppEvent(AppEventType.ClickedOnNotification, null));
  }
  private onSaveError() {
    this.isSaving = false;
  }

  CancelSVO(VOFormElement: any, i: any) {
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
  }

  deleteSVO(VOFormElement: any, i: any) {}

  queryData() {
    this.search.page = this.pageContext.page;
    this.search.size = this.pageContext.itemsPerPage;
    this.search.sort = this.pageContext.sort;
    if(this.filteredInverd != undefined){
      this.search={}
      this.search['inwardNumber.in']=this.filteredInverd
    }

    this.lookupService
      .queryForLetterList(this.search)
      .subscribe((res: HttpResponse<DakMasterDTO[]>) => {
        const temp: DakMasterDTO[] = [];
        this.dataSource.data = res.body != null ? res.body : temp;
        this.bindDataWithTable();
        this.isLoading = false;
        this.totalcount =
          res.headers.get('X-Total-Count') != undefined
            ? Number(res.headers.get('X-Total-Count'))
            : 0;
      });
  }

  searchClient(search: any) {
    this.search['clientName.contains'] = search.term;
    this.lookupService
      .queryMarkerList(this.search)
      .subscribe((res: HttpResponse<SecurityUserDTO[]>) => {
        const temp: SecurityUserDTO[] = [];
        this.markerList = res.body != null ? res.body : temp;
      });
  }

  selectedMarkerId(e: SecurityUserDTO, index: number) {
    this.assignedTo = e?.id;
    this.selectedIndex = index;
    this.search['organizationId.equals'] = this.user.organization?.id;
    //console.log('selected MArker____' + JSON.stringify(e));
  }

  goToView(VOForm: any, i: any) {
    this.router.navigateByUrl(
      '/home/letter/viewLetter/ ' + parseInt(VOForm.get('VORows').at(i).value.id)
    );
  }
  add() {
    this.router.navigateByUrl('home/letter/create');
  }
  onSearch(reset: boolean = false) {
    if (reset) {
      this.search = {};
      this.search['currentStatus.equals'] = DakMasterDTO.currentStatusEnum.ASSIGNED;
      this.search['dakAssignee.equals'] = this.user.id;
      this.search['organizationId.equals'] = this.user.organization?.id;
      this.search['securityRoleId.equals'] = 6;
      this.filteredInverd = undefined;
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
}
