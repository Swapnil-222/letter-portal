import { Injectable } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { NgxRolesService } from 'ngx-permissions';
import { AuthService } from '@core/authentication';
import { Menu, MenuService } from './menu.service';
import { UserDTO } from '@shared/model/userDTO';

@Injectable({
  providedIn: 'root',
})
export class StartupService {
  constructor(
    private authService: AuthService,
    private menuService: MenuService,
    private rolesService: NgxRolesService
  ) {}

  /**
   * Load the application only after get the menu or other essential informations
   * such as permissions and roles.
   */
  load() {
    return new Promise<void>((resolve, reject) => {
      this.authService
        .change()
        .pipe(
          tap(user => this.setPermissions(user)),
          switchMap(() => this.authService.menu()),
          tap(menu => this.setMenu(menu))
        )
        .subscribe(
          () => resolve(),
          () => resolve()
        );
    });
  }

  private setMenu(menu: Menu[]) {
    this.menuService.addNamespace(menu, 'menu');
    this.menuService.set(menu);
  }

  private setPermissions(user: UserDTO) {
    // In a real app, you should get permissions and roles from the user information.

    //this.permissonsService.loadPermissions(permissions);
    this.rolesService.flushRolesAndPermissions();
    let permissions: string[] =
      user.authorities != null ? user.authorities : ['canAdd', 'canDelete', 'canEdit', 'canRead'];
    let cuurentRole: string = user?.roles ? user.roles[0]:"";
    this.rolesService.addRoleWithPermissions(cuurentRole, permissions);

  }
}
