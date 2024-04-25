import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@core';
import { CommentMasterDTO } from '@shared/model/CommentMasterDTO';
import { CountDTO } from '@shared/model/countDTO';
import { DakMasterDTO } from '@shared/model/DakMasterDTO';
import { EmployeeInwardCounts } from '@shared/model/EmployeeInwardCounts';
import { GhoshwaraDTO } from '@shared/model/GhoshwaraDTO';
import { HearingDetailsDTO } from '@shared/model/HearingDetailsDTO';
import { OrganizationDTO } from '@shared/model/organizationDTO';
import { OutWardDTO } from '@shared/model/OutWardDTO';
import { ParamterLookupDTO } from '@shared/model/parameterLookupDTO';
import { SecurityRoleDTO } from '@shared/model/securityRoleDTO';
import { SecurityUserDTO } from '@shared/model/securityUserDTO';
import { UserDTO } from '@shared/model/userDTO';
import { createRequestOptionAllRecords } from '@shared/utils/request-util';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LookupService {
  private SERVER_API_URL = environment.serviceUrl;

  constructor(private http: HttpClient,
    private auth: AuthService) {}

  /**  Query Methods  STARTS */

  checkParameterType(req: any) {
    return createRequestOptionAllRecords(req);
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

  getSecurityUser(id: number): Observable<HttpResponse<SecurityUserDTO>> {
    return this.http.get<SecurityUserDTO>(this.SERVER_API_URL + '/security-users/' + id, {
      observe: 'response',
    });
  }

  getClient(id: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.SERVER_API_URL + '/client-details/' + id, {
      observe: 'response',
    });
  }

  getSecurityUserById(id: number): Observable<HttpResponse<SecurityUserDTO>> {
    return this.http.get<SecurityUserDTO>(this.SERVER_API_URL + '/security-users/' + id, {
      observe: 'response',
    });
  }
  getLetterById(id: number): Observable<HttpResponse<DakMasterDTO[]>> {
    return this.http
      .get<DakMasterDTO[]>(this.SERVER_API_URL + '/dak-masters/' + id, { observe: 'response' })
      .pipe(map((res: HttpResponse<any>) => res));
  }
  getCommentById(): Observable<HttpResponse<CommentMasterDTO[]>> {
    return this.http
      .get<CommentMasterDTO[]>(this.SERVER_API_URL + '/comment-masters', { observe: 'response' })
      .pipe(map((res: HttpResponse<any>) => res));
  }
  // getOutwardNumber(organisationId?: any): Observable<HttpResponse<DakMasterDTO[]>> {
  //   return this.http
  //     .get<CommentMasterDTO[]>(this.SERVER_API_URL + '/dak-masters/outward/' + organisationId.id, { observe: 'response' })
  //     .pipe(map((res: HttpResponse<any>) => res));


  //   // const obj = this.convertDatesFromClient(organisationId);
  //   // return this.http.get<DakMasterDTO[]>(this.SERVER_API_URL + `/dak-masters/outward/${obj}`, {
  //   //   params: this.checkParameterType(organisationId),
  //   //   observe: 'response',
  //   // });
  // }

  getOutwardNumber(orgId: any): Observable<HttpResponse<OutWardDTO[]>> {
    return this.http.get<OutWardDTO[]>(this.SERVER_API_URL + '/dak-masters/outward/' + orgId, {
      params: this.checkParameterType(orgId),
      observe: 'response',
    });
  }
  handoverReport(req?: any,date?: any): Observable<HttpResponse<DakMasterDTO[]>> {
    return this.http.get<DakMasterDTO[]>(this.SERVER_API_URL + '/dak-masters/handedover/report/'+ date, {
      params: this.checkParameterType(req),
      observe: 'response',
    });
  }
  queryHearing(req?: any): Observable<HttpResponse<HearingDetailsDTO[]>> {
    return this.http.get<HearingDetailsDTO[]>(this.SERVER_API_URL + '/hearing-details', {
      params: this.checkParameterType(req),
      observe: 'response',
    });
  }
  queryTodaysHearing(req?: any): Observable<HttpResponse<HearingDetailsDTO[]>> {
    return this.http.get<HearingDetailsDTO[]>(this.SERVER_API_URL + '/hearing-details/todaysHearing', {
      params: this.checkParameterType(req),
      observe: 'response',
    });
  }
  queryHearingNByDakId(req?: any): Observable<HttpResponse<HearingDetailsDTO>> {
    return this.http.get<HearingDetailsDTO>(this.SERVER_API_URL + '/hearing-details', {
      params: this.checkParameterType(req),
      observe: 'response',
    });
  }

  querySecurityUser(req?: any): Observable<HttpResponse<SecurityUserDTO[]>> {
    return this.http.get<SecurityUserDTO[]>(this.SERVER_API_URL + '/security-users', {
      params: this.checkParameterType(req),
      observe: 'response',
    });
  }
  querySecurityUserList(req?: any): Observable<HttpResponse<SecurityUserDTO>> {
    return this.http.get<SecurityUserDTO>(this.SERVER_API_URL + '/security-users', {
      params: this.checkParameterType(req),
      observe: 'response',
    });
  }
  userLoginDetails(req?: any): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.SERVER_API_URL + '/loggedInUser', {
      params: this.checkParameterType(req),
      observe: 'response',
    });
  }
  querySecurityUserCount(req?: any): Observable<HttpResponse<CountDTO>> {
    return this.http.get<CountDTO>(this.SERVER_API_URL + '/security-users/count', {
      params: this.checkParameterType(req),
      observe: 'response',
    });
  }

  getOrganizationList(req?: any): Observable<HttpResponse<OrganizationDTO[]>> {
    return this.http.get<OrganizationDTO[]>(this.SERVER_API_URL + '/organizations', {
      params: this.checkParameterType(req),
      observe: 'response',
    });
  }
  getSecurityRoleList(req?: any): Observable<HttpResponse<SecurityRoleDTO[]>> {
    return this.http.get<SecurityRoleDTO[]>(this.SERVER_API_URL + '/security-roles', {
      params: this.checkParameterType(req),
      observe: 'response',
    });
  }
  getOrganizationsCount(req?: any): Observable<HttpResponse<CountDTO>> {
    return this.http.get<CountDTO>(this.SERVER_API_URL + '/organizations/count', {
      params: this.checkParameterType(req),
      observe: 'response',
    });
  }

  queryParameterList(req?: any): Observable<HttpResponse<ParamterLookupDTO[]>> {
    return this.http.get<ParamterLookupDTO[]>(this.SERVER_API_URL + '/parameter-lookups', {
      params: this.checkParameterType(req),
      observe: 'response',
    });
  }

  getUserById(id: number): Observable<HttpResponse<UserDTO>> {
    return this.http.get<UserDTO>('http://localhost:3000/posts/' + id, {
      observe: 'response',
    });
  }

  queryUserList(req?: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>('http://localhost:3000/posts', {
      params: this.checkParameterType(req),
      observe: 'response',
    });
  }

  downloadCOA(filename?: any): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({ Accept: 'application/pdf' });

    return this.http.get(this.SERVER_API_URL + '/download-file/' + filename, {
      headers,
      observe: 'response',
      responseType: 'blob',
    });
  }

  queryForLetterList(req?: any): Observable<HttpResponse<DakMasterDTO[]>> {
    return this.http.get<DakMasterDTO[]>(this.SERVER_API_URL + '/dak-masters', {
      params: this.checkParameterType(req),
      observe: 'response',
    });
  }
  queryForLetterFilter(req?: any): Observable<HttpResponse<DakMasterDTO[]>> {
    return this.http.get<DakMasterDTO[]>(this.SERVER_API_URL + '/dak-masters/searchDak', {
      params: this.checkParameterType(req),
      observe: 'response',
    });
  }
  getComment(req?: any): Observable<HttpResponse<CommentMasterDTO[]>> {
    return this.http.get<CommentMasterDTO[]>(this.SERVER_API_URL + '/comment-masters', {
      params: this.checkParameterType(req),
      observe: 'response',
    });
  }

  queryForNondwahiList(req?: any): Observable<HttpResponse<DakMasterDTO[]>> {
    return this.http.get<DakMasterDTO[]>(this.SERVER_API_URL + '/dak-masters', {
      params: this.checkParameterType(req),
      observe: 'response',
    });
  }

  queryMarkerList(req?: any): Observable<HttpResponse<DakMasterDTO[]>> {
    return this.http.get<DakMasterDTO[]>(this.SERVER_API_URL + '/security-users', {
      params: this.checkParameterType(req),
      observe: 'response',
    });
  }

  queryletterCount(req?: any): Observable<HttpResponse<CountDTO>> {
    return this.http.get<CountDTO>(this.SERVER_API_URL + '/dak-masters/count', {
      params: this.checkParameterType(req),
      observe: 'response',
    });
  }

  getHearingById(id: number): Observable<HttpResponse<HearingDetailsDTO[]>> {
    return this.http
      .get<HearingDetailsDTO[]>(this.SERVER_API_URL + '/dak-masters/' + id, { observe: 'response' })
      .pipe(map((res: HttpResponse<HearingDetailsDTO[]>) => res));
  }
  inwardNumberSearch(req?: any): Observable<HttpResponse<DakMasterDTO[]>> {
    return this.http.get<DakMasterDTO[]>(this.SERVER_API_URL + '/dak-masters/searchDak', {
      params: this.checkParameterType(req),
      observe: 'response',
    });
  }

  queryEmployeeInwardStatusCount(req?: any): Observable<HttpResponse<EmployeeInwardCounts[]>> {
    let options: HttpParams = new HttpParams();

    Object.keys(req).forEach(key => {
      options = options.set(key, req[key]);
    });

    return this.http.get<EmployeeInwardCounts[]>(
      this.SERVER_API_URL + '/dak-masters/assignedCount',
      {
        params: this.checkParameterType(req),
        observe: 'response',
      }
    );
  }
  nondwahiReport(req?: any): Observable<HttpResponse<DakMasterDTO[]>> {
    return this.http.get<DakMasterDTO[]>(this.SERVER_API_URL + '/dak-masters/nondwahiReport', {
      params: this.checkParameterType(req),
      observe: 'response',
    });

  }

  downloadNondwahiReport(req?: any): Observable<HttpResponse<any>> {
    // return this.http.get<DakMasterDTO[]>(this.SERVER_API_URL + '/dak-masters/nondwahiReport', {
    //   params: this.checkParameterType(req),
    //   observe: 'response',
    // });

    const headers = new HttpHeaders({ Accept: 'application/pdf' });
    return this.http.get(this.SERVER_API_URL + '/dak-masters/nondwahiReport', {
      params: this.checkParameterType(req),
      headers,
      observe: 'response',
      responseType: 'blob',
    });
  }
  downloadGhoshwaraReport(req?: any): Observable<HttpResponse<any>> {
    // return this.http.get<DakMasterDTO[]>(this.SERVER_API_URL + '/dak-masters/nondwahiReport', {
    //   params: this.checkParameterType(req),
    //   observe: 'response',
    // });

    const headers = new HttpHeaders({ Accept: 'application/pdf' });
    return this.http.get(this.SERVER_API_URL + '/ghoshwara/report/pdf', {
      params: this.checkParameterType(req),
      headers,
      observe: 'response',
      responseType: 'blob',
    });
  }
  downloadAssignedReport(req?: any): Observable<HttpResponse<any>> {
    // return this.http.get<DakMasterDTO[]>(this.SERVER_API_URL + '/dak-masters/nondwahiReport', {
    //   params: this.checkParameterType(req),
    //   observe: 'response',
    // });

    const headers = new HttpHeaders({ Accept: 'application/pdf' });
    return this.http.get(this.SERVER_API_URL + '/dak-masters/assignedLetters/report/pdf', {
      params: this.checkParameterType(req),
      headers,
      observe: 'response',
      responseType: 'blob',
    });
  }
  todaysHearingReport(req?: any): Observable<HttpResponse<any>> {
    // return this.http.get<DakMasterDTO[]>(this.SERVER_API_URL + '/dak-masters/nondwahiReport', {
    //   params: this.checkParameterType(req),
    //   observe: 'response',
    // });

    const headers = new HttpHeaders({ Accept: 'application/pdf' });
    return this.http.get(this.SERVER_API_URL + '/hearing-details/todaysHearing/report', {
      params: this.checkParameterType(req),
      headers,
      observe: 'response',
      responseType: 'blob',
    });
  }
  downloadHandedOverReport(req?: any, formatterDateStartDate?: any): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({ Accept: 'application/pdf' });
    return this.http.get(this.SERVER_API_URL + '/dak-masters/handedover/report/pdf/' + formatterDateStartDate , {
      params: this.checkParameterType(req),
      headers,
      observe: 'response',
      responseType: 'blob',
    });
  }

  queryGoshwara(req?: any): Observable<HttpResponse<GhoshwaraDTO[]>> {
    return this.http.get<GhoshwaraDTO[]>(this.SERVER_API_URL + '/ghoshwaras', {
      params: this.checkParameterType(req),
      observe: 'response',
    });
  }
  queryHandedOverRerport(req?: any): Observable<HttpResponse<DakMasterDTO[]>> {
    return this.http.get<DakMasterDTO[]>(this.SERVER_API_URL + '/dak-masters/handedover/report', {
      params: this.checkParameterType(req),
      observe: 'response',
    });
  }
}
