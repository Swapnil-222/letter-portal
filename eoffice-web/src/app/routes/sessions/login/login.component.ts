import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { AuthService } from '@core/authentication';
import { NgxRolesService } from 'ngx-permissions';
import { StartupService } from '@core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  isSubmitting = false;
  hide = true;
  pass = new FormControl('', [Validators.required, Validators.maxLength(5)]);
  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private startupService: StartupService
  ) {}

  ngOnInit() {}

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe');
  }

  login() {
    this.isSubmitting = true;

    this.auth
      .login('/authenticate', this.username?.value, this.password?.value, this.rememberMe?.value)
      .subscribe(
        user => {

          this.startupService.load();

          this.auth.setup(user);

          const myRole = user?.roles![0];

          if (myRole == 'ROLE_SUPER_ADMIN' || myRole == 'ROLE_ADMIN') {
            this.router.navigateByUrl('/home/admin/user');
          } if (myRole == 'ROLE_ORG_ADMIN') {
            this.router.navigateByUrl('/home/admin/user');
          } else if (myRole == 'ROLE_HEAD_OFFICE') {
            this.router.navigateByUrl('home/dashboard');
          } else if (myRole == 'ROLE_CLERK') {
            this.router.navigateByUrl('/home/letter/new-letters-clerk');
          } else if (myRole == 'ROLE_MARKER') {
            this.router.navigateByUrl('home/letter/new-letters-marker');
          } else if (myRole == 'ROLE_EMP') {
            this.router.navigateByUrl('home/letter/my-assignment');
          }

          console.log('Loged in Successfully!!');
        },
        (errorRes: HttpErrorResponse) => {
          if (errorRes.status === 422) {
            const form = this.loginForm;
            const errors = errorRes.error.errors;
            Object.keys(errors).forEach(key => {
              form.get(key === 'email' ? 'username' : key)?.setErrors({
                remote: errors[key][0],
              });
            });
          }
          this.isSubmitting = false;
        }
      );
      //console.log(this.rememberMe?.value);
  }
}
