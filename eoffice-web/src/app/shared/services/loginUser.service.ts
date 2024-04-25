import { Injectable } from '@angular/core';
import { SecurityUserDTO } from '@shared/model/securityUserDTO';

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  loggedUser: any;

  setloggedUser(securityUserDTO: SecurityUserDTO) {
    this.loggedUser = securityUserDTO;
  }

  getloggedUser() {
    return this.loggedUser;
  }

  clearloggedUser() {
    this.loggedUser = null;
  }
}
