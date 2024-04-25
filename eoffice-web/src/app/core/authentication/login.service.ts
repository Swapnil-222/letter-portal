import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Token, User } from './interface';
import { Menu } from '@core';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { UserDTO } from '@shared/model/userDTO';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private SERVER_API_URL = environment.serviceUrl;

  constructor(protected http: HttpClient) {}

  login(url: string,username: string, password: string, rememberMe = false) {
    //return this.http.post<Token>('/auth/login', { username, password, rememberMe });

    return this.http
      .post<Token>(this.SERVER_API_URL + url, {
        username,
        password,
        rememberMe
      });
  }

  refresh(params: Record<string, any>) {
    return this.http.post<Token>('/auth/refresh', params);
  }

  logout() {
    return this.http.post<any>('/auth/logout', {});
  }

  // me() {
  //   return this.http.get<User>('/me');
  // }

  account() {
    //return this.http.get<User>('/me');
    return this.http.get<UserDTO>(this.SERVER_API_URL + '/account');
  }

  menu() {
    //return this.http.get<{ menu: Menu[] }>('/me/menu').pipe(map(res => res.menu));
    return this.http.get<{ menu: Menu[] }>('assets/data/menu.json?_t=' + Date.now()).pipe(map(res => res.menu));
  }
}
