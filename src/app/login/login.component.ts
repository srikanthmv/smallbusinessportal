import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {UserLoginModel} from '../models/user-login.model';
import {EmailValidator, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userLoginInfoFg: FormGroup = new FormGroup({});
  constructor(private authenticationService: AuthenticationService, private fb: FormBuilder,
    private fAuth: AngularFireAuth, private router: Router) {
    this.userLoginInfoFg = this.fb.group({
      username: [null, [Validators.required, new EmailValidator()]],
      password: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.fAuth.authState.subscribe(user => {
      if (user){
        localStorage.setItem('$token', JSON.stringify(user));
        this.router.navigate(['/admin/dashboard'])
      } else {
        localStorage.setItem('$token', '');
      }
    })
  }

  get username(): FormControl {
    return this.userLoginInfoFg.get('username') as FormControl;
  }

  get password(): FormControl {
    return this.userLoginInfoFg.get('password') as FormControl;
  }

  loginWithAdmin(): void {
    if (this.userLoginInfoFg?.valid) {
      this.authenticationService.loginAdminUser(this.userLoginInfoFg.value);
    }
  }
}
