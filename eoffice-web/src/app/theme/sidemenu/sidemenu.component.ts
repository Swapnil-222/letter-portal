import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService, Menu, MenuService } from '@core';
import { AppEventType } from '@shared/constants/app_event';
import { CountDTO } from '@shared/model/countDTO';
import { DakMasterDTO } from '@shared/model/DakMasterDTO';
import { UserDTO } from '@shared/model/userDTO';
import { LookupService } from '@shared/services';
import { EventQueueService } from '@shared/services/event_queue_service.service';
import { Common } from '@shared/utils/common';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidemenuComponent implements OnInit {
  // NOTE: Ripple effect make page flashing on mobile
  @Input() ripple = false;

  menu$ = this.menu.getAll();
  buildRoute = this.menu.buildRoute;
  user!: UserDTO;

  loadCount: number = 0;

  constructor(
    private authService: AuthService,
    private menu: MenuService,
    private lookupService: LookupService,
    private eventQueue: EventQueueService
  ) {}

  ngOnInit(): void {
    this.eventQueue.on(AppEventType.ClickedOnNotification).subscribe(event => this.handleEvent());

    this.user = this.authService.getUser();

    this.menu$.subscribe(menu => {
      if (Common.isNotEmpty(menu)) {
        this.loadCount++;
        this.handleEvent();
      }
      console.log(this.loadCount);
    });
  }

  handleEvent(): void {
    const myRole = this.user?.roles![0];

    if (myRole == 'ROLE_SUPER_ADMIN') {
      this.loadSecurityUserCount({ 'securityRoleId.equals': 2 });
      this.loadOrganizationCount({ 'isActivate.equals': true });
    } else if (myRole == 'ROLE_ORG_ADMIN') {
      this.loadSecurityUserCount({ 'organizationId.equals': this.user.organization?.id });
    } else if (myRole == 'ROLE_HEAD_OFFICE') {
      this.loadLetterListCount(
        {
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
        },
        8
      );

      this.loadLetterListCount(
        { 'currentStatus.equals': 'HEARING', 'organizationId.equals': this.user.organization?.id },
        9
      );

      this.loadLetterListCount(
        { 'currentStatus.equals': 'CLEARED', 'organizationId.equals': this.user.organization?.id },
        10
      );
    } else if (myRole == 'ROLE_CLERK') {
      this.loadLetterListCount(
        {
          'currentStatus.in': ['CREATED', 'UPDATED'],
          'organizationId.equals': this.user.organization?.id,
        },
        5
      );

      this.loadLetterListCount(
        {
          'currentStatus.in': [
            DakMasterDTO.currentStatusEnum.ASSIGNED,
            DakMasterDTO.currentStatusEnum.HEARING,
            DakMasterDTO.currentStatusEnum.AWAITED_FOR_ORDER,
            DakMasterDTO.currentStatusEnum.AWAITED,
            DakMasterDTO.currentStatusEnum.CLEARED,
          ],
          'dispatchedBy.equals': this.user?.id,
        },
        6
      );
    } else if (myRole == 'ROLE_MARKER') {
      this.loadLetterListCount(
        {
          'currentStatus.in': DakMasterDTO.currentStatusEnum.ASSIGNED,
          'organizationId.equals': this.user.organization?.id,
          'dakAssignee.equals': this.user?.id,
          'securityRoleId.equals': 6,
        },
        11
      );

      this.loadLetterListCount(
        {
          'organizationId.equals': this.user.organization?.id,
          'dakAssignedFrom.equals': this.user?.id,
        },
        15
      );
    } else if (myRole == 'ROLE_EMP') {
      this.loadLetterListCount(
        {
          'currentStatus.in': [
            DakMasterDTO.currentStatusEnum.ASSIGNED,
            DakMasterDTO.currentStatusEnum.AWAITED,
            DakMasterDTO.currentStatusEnum.HEARING,
            DakMasterDTO.currentStatusEnum.AWAITED_FOR_ORDER,
          ],
          'organizationId.equals': this.user.organization?.id,
          'dakAssignee.equals': this.user?.id,
        },
        7
      );

      this.loadLetterListCount(
        {
          'currentStatus.in': [
            DakMasterDTO.currentStatusEnum.HEARING,
            DakMasterDTO.currentStatusEnum.HEARING_AWAITED,
            DakMasterDTO.currentStatusEnum.HEARING_COMPLETED,
          ],
          'dakAssignee.equals': this.user?.id,
          'organizationId.equals': this.user.organization?.id,
        },
        9
      );

      this.loadLetterListCount(
        {
          'currentStatus.equals': 'CLEARED',
          'dakAssignee.equals': this.user?.id,
          'organizationId.equals': this.user.organization?.id,
        },
        10
      );
    }
  }

  //Server call methods
  loadLetterListCount(search: any, menuId: number) {
    this.lookupService.queryletterCount(search).subscribe((req: HttpResponse<CountDTO>) => {
      let pendingLetter: CountDTO = { count: 0 };
      pendingLetter = req.body != null ? req.body : pendingLetter;

      let menu: Menu = this.menu.getMenuById(menuId);
      if (menu) {
        menu.badge = {
          color: 'red-500',
          value: `${pendingLetter.count}`,
        };
        this.menu.update(menu);
      }
    });
  }
  loadTodaysHearingCount() {
    this.lookupService
      .queryletterCount({
        'currentStatus.equals': 'HEARING',
        'organizationId.equals': this.user.organization?.id,
      })
      .subscribe((req: HttpResponse<CountDTO>) => {
        let hearingLetterCount: CountDTO = { count: 0 };
        hearingLetterCount = req.body != null ? req.body : hearingLetterCount;
        let menu: Menu = this.menu.getMenuById(1);
        if (menu) {
          menu.badge = {
            color: 'red-500',
            value: `${hearingLetterCount.count}`,
          };
          this.menu.update(menu);
        }
      });
  }
  loadOrganizationCount(search: any) {
    this.lookupService
      .getOrganizationsCount(search != null ? search : '')
      .subscribe((req: HttpResponse<CountDTO>) => {
        let pendingLetter: CountDTO = { count: 0 };
        pendingLetter = req.body != null ? req.body : pendingLetter;

        let menu: Menu = this.menu.getMenuById(3);
        if (menu) {
          menu.badge = {
            color: 'red-500',
            value: `${pendingLetter.count}`,
          };
          this.menu.update(menu);
        }
      });
  }

  loadSecurityUserCount(search: any) {
    this.lookupService
      .querySecurityUserCount(search != null ? search : '')
      .subscribe((req: HttpResponse<CountDTO>) => {
        let pendingLetter: CountDTO = { count: 0 };
        pendingLetter = req.body != null ? req.body : pendingLetter;

        let menu: Menu = this.menu.getMenuById(2);
        if (menu) {
          menu.badge = {
            color: 'red-500',
            value: `${pendingLetter.count}`,
          };
          this.menu.update(menu);
        }
      });
  }
}
