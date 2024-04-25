import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@core';
import { DakMasterDTO } from '@shared/model/DakMasterDTO';
import { HearingDetailsDTO } from '@shared/model/HearingDetailsDTO';
import { OrganizationDTO } from '@shared/model/organizationDTO';
import { ParamterLookupDTO } from '@shared/model/parameterLookupDTO';
import { SecurityUserDTO } from '@shared/model/securityUserDTO';
import { UserDTO } from '@shared/model/userDTO';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OperationsService {
  private SERVER_API_URL = environment.serviceUrl;

  constructor(private http: HttpClient,
    private auth: AuthService) {
    // warehouseService.labId.subscribe()
  }

  convertDatesFromClient(req: any) {
    let localDate = new Date();
    let tempDate = JSON.stringify(localDate).substring(1, 25);
    req.lastModified = tempDate;

    const user: UserDTO  = this.auth.getUser();
    // let user: UserDTO = this.warehouseService.getloggedUser();
    // req.lastModifiedBy = user.login ? user.firstName + user?.lastName : "NA";
    req.lastModifiedBy = user.login ;
    return req;
  }

  uploadMultipartFile(formData: FormData, productId: any): Observable<HttpResponse<any>> {
    const obj = this.convertDatesFromClient(formData);
    return this.http
      .post<any>(this.SERVER_API_URL + '/uploadPdfFile/' + productId, obj, { observe: 'response' })
      .pipe(map((res: HttpResponse<any>) => res));
  }

  createSecurityUser(project: SecurityUserDTO): Observable<HttpResponse<SecurityUserDTO>> {
    const obj = this.convertDatesFromClient(project);
    return this.http
      .post<SecurityUserDTO>(this.SERVER_API_URL + '/security-users', obj, { observe: 'response' })
      .pipe(map((res: HttpResponse<SecurityUserDTO>) => res));
  }
  updateSecurityUser(objVal: SecurityUserDTO): Observable<HttpResponse<SecurityUserDTO>> {
    const obj = this.convertDatesFromClient(objVal);
    return this.http
      .put<SecurityUserDTO>(this.SERVER_API_URL + '/security-users/' + obj.id, obj, {
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<SecurityUserDTO>) => res));
  }
  createOrganization(project: OrganizationDTO): Observable<HttpResponse<OrganizationDTO>> {
    const obj = this.convertDatesFromClient(project);
    return this.http
      .post<OrganizationDTO>(this.SERVER_API_URL + '/organizations', obj, { observe: 'response' })
      .pipe(map((res: HttpResponse<OrganizationDTO>) => res));
  }

  updateOrganization(objVal: OrganizationDTO): Observable<HttpResponse<OrganizationDTO>> {
    const obj = this.convertDatesFromClient(objVal);
    return this.http
      .put<OrganizationDTO>(this.SERVER_API_URL + '/organizations/' + obj.id, obj, {
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<OrganizationDTO>) => res));
  }
  createParameter(project: ParamterLookupDTO): Observable<HttpResponse<ParamterLookupDTO>> {
    const obj = this.convertDatesFromClient(project);
    return this.http
      .post<ParamterLookupDTO>(this.SERVER_API_URL + '/parameter-lookups', obj, { observe: 'response' })
      .pipe(map((res: HttpResponse<ParamterLookupDTO>) => res));
  }
  updateParameter(objVal: ParamterLookupDTO): Observable<HttpResponse<ParamterLookupDTO>> {
    const obj = this.convertDatesFromClient(objVal);
    return this.http
      .put<ParamterLookupDTO>(this.SERVER_API_URL + '/parameter-lookups/' + obj.id, obj, {
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<ParamterLookupDTO>) => res));
  }

  deleteParameter(objVal: ParamterLookupDTO):  Observable<HttpResponse<ParamterLookupDTO>>  {
    return this.http
    .delete<ParamterLookupDTO>(this.SERVER_API_URL + '/parameter-lookups/' + objVal.id, {
      observe: 'response',
    })
    .pipe(map((res: HttpResponse<ParamterLookupDTO>) => res));
  }
  deleteOrganization(objVal:OrganizationDTO):  Observable<HttpResponse<OrganizationDTO>>  {
    return this.http
    .delete<OrganizationDTO>(this.SERVER_API_URL + '/organizations/' + objVal.id, {
      observe: 'response',
    })
    .pipe(map((res: HttpResponse<OrganizationDTO>) => res));
  }
  deleteSecurityUser(objVal: SecurityUserDTO): Observable<HttpResponse<SecurityUserDTO>> {
    return this.http
      .delete<SecurityUserDTO>(this.SERVER_API_URL + '/security-users/' + objVal.id, {
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<SecurityUserDTO>) => res));
  }

  changePassword(newPassword: string, currentPassword: string): Observable<{}> {
    return this.http.post(this.SERVER_API_URL + '/account/change-password', {
      currentPassword,
      newPassword,
    });
  }
  createLetter(param: DakMasterDTO): Observable<HttpResponse<DakMasterDTO>> {
    const obj = this.convertDatesFromClient(param);
    return this.http
      .post<DakMasterDTO>(this.SERVER_API_URL + '/dak-masters', obj, { observe: 'response' })
      .pipe(map((res: HttpResponse<DakMasterDTO>) => res));
  }
  updateLetter(param: DakMasterDTO): Observable<HttpResponse<DakMasterDTO>> {
    const obj = this.convertDatesFromClient(param);
    return this.http
      .put<DakMasterDTO>(this.SERVER_API_URL + `/dak-masters/${obj.id}`, obj, { observe: 'response' })
      .pipe(map((res: HttpResponse<DakMasterDTO>) => res));
  }
  updateTranferLetter(param: DakMasterDTO): Observable<HttpResponse<DakMasterDTO>> {
    const obj = this.convertDatesFromClient(param);
    return this.http
      .put<DakMasterDTO>(this.SERVER_API_URL + `/dak-masters/transfer/${obj.id}`, obj, { observe: 'response' })
      .pipe(map((res: HttpResponse<DakMasterDTO>) => res));
  }
  createHearing(param: HearingDetailsDTO): Observable<HttpResponse<HearingDetailsDTO>> {
    const obj = this.convertDatesFromClient(param);
    return this.http
      .post<HearingDetailsDTO>(this.SERVER_API_URL + '/hearing-details', obj, { observe: 'response' })
      .pipe(map((res: HttpResponse<HearingDetailsDTO>) => res));
  }
  updateHearing(param: HearingDetailsDTO): Observable<HttpResponse<HearingDetailsDTO>> {
    const obj = this.convertDatesFromClient(param);
    return this.http
      .put<HearingDetailsDTO>(this.SERVER_API_URL + `/hearing-details/${obj.id}`, obj, { observe: 'response' })
      .pipe(map((res: HttpResponse<HearingDetailsDTO>) => res));
  }

}
