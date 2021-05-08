import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import {CommonService} from '../services/common.service';
import {AccountService} from "../services/account/account.service";
import {AccountModel} from "../models/account.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [
      './header.component.scss'
  ]
})
export class HeaderComponent implements OnInit {
  userLoggedIn: boolean | undefined;
  accountInfo: AccountModel | undefined;
  constructor(public commonService: CommonService,
              private authService: AuthenticationService,
              private accountService: AccountService) { }

  ngOnInit(): void {
    this.userLoggedIn = this.authService.isUserLoggedIn();
    this.accountService.accountInfo$.subscribe((accounts) => {
      if (accounts.length) {
        this.accountInfo = accounts[0] as AccountModel;
      }
    })
  }

  toggleNavBar() {
    if (document.getElementById("navbarBasicExample")!.classList.contains("is-active")) {
      document.getElementById("navbarBasicExample")!.classList.remove("is-active")
    } else {
      document.getElementById("navbarBasicExample")!.classList.add("is-active")
    }
  }

}
