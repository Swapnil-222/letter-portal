import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router, RouterLinkWithHref } from '@angular/router';
import { AuthService } from '@core';
import { TranslateService } from '@ngx-translate/core';
import { DakMasterDTO } from '@shared/model/DakMasterDTO';
import { SecurityUserDTO } from '@shared/model/securityUserDTO';
import { UserDTO } from '@shared/model/userDTO';
import { HelperService, LookupService, OperationsService } from '@shared/services';
import { Observable } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ITEMS_PER_PAGE } from '@shared/constants/pagination.constants';
@Component({
  selector: 'app-editable-letter-list',
  templateUrl: './editable-letter-list.component.html',
  styleUrls: ['./editable-letter-list.component.css'],
})
export class EditableLetterListComponent implements OnInit {
  displayedColumns: string[] = [
    'inwardNumber',
    'senderOutward',
    'letterDate',
    'letterReceivedDate',
    'senderName',
    'subject',
    'dakAssignee',
    'action',
  ];
  pgIndex = 2;
  firstLastButtons = true;
  pnDisabled = true;
  hdPageSize = true;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoading = true;
  pageNumber: number = 1;
  VOForm!: FormGroup;
  isEditableNew: boolean = true;
  pageContext = { page: 0, previousPage: 0, itemsPerPage: 0, totalItems: 0, sort: 'id,asc' };
  search: any = {};
  list: DakMasterDTO[] = [];
  @Input() criteria!: any;
  markerList!: SecurityUserDTO[];
  assignedTo: number | undefined;
  selectedMarker!: number;
  isSaving!: boolean;
  user!: UserDTO;
  currentNav: any;
  constructor(
    private fb: FormBuilder,
    private _formBuilder: FormBuilder,
    private lookupService: LookupService,
    private cdr: ChangeDetectorRef,
    private operationService: OperationsService,
    private helperService: HelperService,
    private authService: AuthService,
    public translate: TranslateService,
    private router: Router
  ) {
    this.pageContext.itemsPerPage = ITEMS_PER_PAGE;
    this.pageContext.totalItems = ITEMS_PER_PAGE;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.user = this.authService.getUser();
    this.VOForm = this._formBuilder.group({
      VORows: this._formBuilder.array([]),
    });


    this.isLoading = false;

    this.isLoading = true;
    this.search.page = this.criteria.page;
    this.search.size = this.criteria.size;
    this.search.sort = this.criteria.sort;
    if (this.user.roles![0] == 'ROLE_CLERK') {
      this.search['currentStatus.equals'] = this.criteria['currentStatus.equals'];
    } else if (this.user.roles![0] == 'ROLE_MARKER') {
      this.search['currentStatus.equals'] = this.criteria['currentStatus.in'];
      this.search['dakAssignee.equals'] = this.user.id;
    } else if (this.user.roles![0] == 'ROLE_EMP') {
      this.search['currentStatus.in'] = this.criteria['currentStatus.in'];
      this.search['dakAssignee.equals'] = this.user.id;
      this.cdr.detectChanges();
    }
    this.search['organizationId.equals'] = this.criteria['organizationId.equals'];

    this.lookupService
      .queryForLetterList(this.search)
      .subscribe((res: HttpResponse<DakMasterDTO[]>) => {
        const headers = res.headers;
        this.pageContext.totalItems =
          headers != null ? Number(headers.get('x-total-count')?.toString()) : 0;
        const temp: DakMasterDTO[] = [];
        this.dataSource.data = res.body != null ? res.body : temp;
        this.bindDataWithTable();
        this.isLoading = false;
        this.cdr.detectChanges();
      });

    this.queryData();
  }
  bindDataWithTable() {
    this.VOForm = this.fb.group({
      VORows: this.fb.array(
        this.dataSource.data.map(val =>
          this.fb.group({
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
            letterType: new FormControl(val.letterType),
            isResponseReceived: new FormControl(val.isResponseReceived),
            assignedDate: new FormControl(val.assignedDate),
            lastModified: new FormControl(val.lastModified),
            lastModifiedBy: new FormControl(val.lastModifiedBy),
            dakAssignedFrom: new FormControl(this.user.id),
            dakAssignee: new FormControl(val.dakAssignee),
            dispatchedBy: new FormControl(val.dispatchedBy),
            outwardNumber: new FormControl(val.outwardNumber),
            taluka: new FormControl(val.taluka),
            organization: new FormControl(this.user.organization),
            securityUsers: new FormControl([this.user]),
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
  EditSVOf() {}
  SaveVO(VOFormElement: any, i: any) {
    var rowData = VOFormElement.get('VORows').at(i).value;
    this.subscribeToSaveResponse(this.operationService.updateLetter(rowData));
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
  }
  private onSaveError() {
    this.isSaving = false;
  }

  CancelSVO(VOFormElement: any, i: any) {
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
  }

  deleteSVO(VOFormElement: any, i: any) {}

  queryData() {
    this.isLoading = true;
    this.search.page = this.pageContext.page;
    this.search.size = this.pageContext.itemsPerPage;
    this.search.sort = this.pageContext.sort;
    this.lookupService
      .queryMarkerList(this.search)
      .subscribe((res: HttpResponse<SecurityUserDTO[]>) => {
        const temp: SecurityUserDTO[] = [];
        this.markerList = res.body != null ? res.body : temp;
        this.isLoading = false;
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

  selectedMarkerId(e: SecurityUserDTO) {
    this.assignedTo = e?.id;
    console.log('selected MArker____' + JSON.stringify(e));
  }

  goToView(VOForm: any, i: any) {
    console.log('VO form +++' + JSON.stringify(VOForm.get('VORows').at(i).value.id));
    this.router.navigateByUrl(
      '/home/letter/viewLetter/ ' + parseInt(VOForm.get('VORows').at(i).value.id)
    );
  }
  onChangePage(pe: PageEvent) {
    console.log(pe.pageIndex);
    console.log(pe.pageSize);
  }
}
