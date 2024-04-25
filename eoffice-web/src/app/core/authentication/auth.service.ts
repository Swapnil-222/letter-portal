import { Injectable } from '@angular/core';
import { BehaviorSubject, iif, merge, of } from 'rxjs';
import { catchError, map, share, switchMap, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { LoginService } from './login.service';
import { filterObject, isEmptyObject } from './helpers';
import { Token, User } from './interface';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '@env/environment';
import { UserDTO } from '@shared/model/userDTO';
import { guest } from './user';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user$ = new BehaviorSubject<UserDTO>(guest);
  private SERVER_API_URL = environment.serviceUrl;
  private userReq$ = this.http.get<UserDTO>(this.SERVER_API_URL + '/account');

  private change$ = merge(
    this.tokenService.change(),
    this.tokenService.refresh().pipe(switchMap(() => this.refresh()))
  ).pipe(
    switchMap(() => this.assignUser()),
    share()
  );

  constructor(
    private http: HttpClient,
    private loginService: LoginService,
    private tokenService: TokenService,
    private permissonsService: NgxPermissionsService,
    private rolesService: NgxRolesService
  ) {}

  // init() {
  //   return new Promise<void>(resolve => this.change$.subscribe(() => resolve()));
  // }

  change() {
    return this.assignUser();
  }

  setup(user: UserDTO): Promise<any> {
    user.avatar = './assets/images/avatar.png';

    return new Promise((resolve, reject) => {
      this.tokenService
        .change()
        .pipe(switchMap(() => (this.check() ? this.userReq$ : of(user))))
        .subscribe(user => {
          this.user$.next(Object.assign({}, guest, user));
          resolve(null);
        });
    });
  }

  check() {
    return this.tokenService.valid();
  }

  login(url: string, username: string, password: string, rememberMe : boolean) {
    return this.http
      .post<Token>(this.SERVER_API_URL + url, {
        username,
        password,
        rememberMe,
      })
      .pipe(
        tap(id_token => this.tokenService.createAndSet(id_token)),
        map(() => this.check()),
        switchMap(() => (this.check() ? this.userReq$ : of(guest)))
      );
  }

  // account(url: string) {

  //   return this.http.get<UserDTO>(this.SERVER_API_URL + '/account')
  //     .pipe(
  //       tap(user => {this.user$.next(Object.assign({}, guest, user));}),
  //       map(() => this.check())
  //     );
  // }

  refresh() {
    return this.loginService
      .refresh(filterObject({ refresh_token: this.tokenService.getRefreshToken() }))
      .pipe(
        catchError(() => of(undefined)),
        tap(token => this.tokenService.set(token)),
        map(() => this.check())
      );
  }
  hasAnyAuthority(requestedAuthorities: string[]): boolean {
    let user: UserDTO = this.user$.getValue();
    if (!user.authorities) {
      return false;
    }
    for (const item of requestedAuthorities) {
      if (user.authorities.includes(item)) {
        return true;
      }
    }
    return false;
  }
  hasAnyAuthoritySub(requestedAuthorities: string[]): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.user$.subscribe(user => {
        if (!user.authorities) {
          resolve(false);
          return;
        }
        for (const item of requestedAuthorities) {
          if (user.authorities.includes(item)) {
            resolve(true);
            return;
          }
        }
        resolve(false);
      });
    });
  }


  // logout() {
  //   return this.loginService.logout().pipe(
  //     tap(() => this.tokenService.clear()),
  //     map(() => this.check())
  //   );
  // }

  logout() {
    let user: UserDTO = this.user$.getValue();
    return this.http
      .post<any>(
        this.SERVER_API_URL + '/logout',
        { username: user.username, password: '*****' },
        { observe: 'response' }
      )
      .pipe(
        tap(() => this.tokenService.clear()),
        map((res: HttpResponse<any>) => res)
      );
  }

  user() {
    return this.user$.pipe(share());
  }

  menu() {
    return iif(() => this.check(), this.loginService.menu(), of([]));
  }

  private assignUser() {
    if (!this.check()) {
      return of({}).pipe(tap(user => this.user$.next(user)));
    }

    // if (this.check()) {
    //   return of(this.user$.getValue());
    // }

    return this.loginService.account().pipe(
      tap(user => {
        this.user$.next(Object.assign({}, guest, user));
      })
    );
  }

  getUser() {
    let user: UserDTO = this.user$.getValue();
    return user;
  }
}
