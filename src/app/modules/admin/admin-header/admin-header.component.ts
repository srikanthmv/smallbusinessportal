import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {AccountService} from "../../../services/account/account.service";
import {AccountModel} from "../../../models/account.model";

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {
  accountInfo: AccountModel | undefined;
  constructor(private authService: AuthenticationService,
              private router: Router,
              private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.accountInfo$.subscribe((accounts) => {
      if (accounts.length) {
        this.accountInfo = accounts[0] as AccountModel;
      }
    })
  }

  logout() {
    this.authService.logoutAdmin().then(() => {
      this.router.navigate(['/admin/admin-login']);
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
