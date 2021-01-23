import { AngularFireAuth } from '@angular/fire/auth';
import {UserLoginModel} from '../models/user-login.model';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private fAuth: AngularFireAuth) {
  }

  loginAdminUser(userLoginModel: UserLoginModel): void {
    this.fAuth.signInWithEmailAndPassword(userLoginModel.username, userLoginModel.password).then((resp) => {
      if (resp) {
        localStorage.setItem('$token', JSON.stringify(resp));
      } else {
        localStorage.removeItem('$token');
      }
    });
  }

  isUserLoggedIn(): boolean {
    return (localStorage.getItem("$token") !== null || localStorage.getItem("$token") !== '');
  }

  updateTokenIfUserIsAvailable() {
    this.fAuth.authState.subscribe((userResp) => {
      if (userResp) {
        localStorage.setItem('$token', JSON.stringify(userResp))
      } else {
        localStorage.removeItem('$token');
      }
    })
  }

  logoutAdmin(): Promise<void> {
    return this.fAuth.signOut()
  }
}
