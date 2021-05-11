import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import {CommonService} from '../services/common.service';
import {AccountService} from "../services/account/account.service";
import {AccountModel} from "../models/account.model";
import {Router} from "@angular/router";
import {Category} from "../models/category.model";
import {ItemSearchFilterModel} from "../models/item-search-filter.model";

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
              private accountService: AccountService,
              private router: Router) { }

  ngOnInit(): void {
    this.userLoggedIn = this.authService.isUserLoggedIn();
    this.accountService.accountInfo$.subscribe((accounts) => {
      if (accounts.length) {
        this.accountInfo = accounts[0] as AccountModel;
      }
    })
  }

  toggleNavBar() {
    if (document.getElementById("smallBusinessPortalMenuBar")!.classList.contains("is-active")) {
      document.getElementById("smallBusinessPortalMenuBar")!.classList.remove("is-active")
    } else {
      document.getElementById("smallBusinessPortalMenuBar")!.classList.add("is-active")
    }
  }

  navigateToUrl(route: string, params?: any): void {
    this.toggleNavBar();
    if (params) {
      this.router.navigate([`${route}`], {queryParams: params}).then();
    } else {
      this.router.navigate([`${route}`]).then();
    }
  }

  navigateToCategories(categoryInfo: Category) {
    const searchFilters = {category: categoryInfo?.slug} as ItemSearchFilterModel
    // this.router.navigate(['items-list'], {queryParams: searchFilters}).then();
    this.navigateToUrl('items-list', searchFilters)
  }

}
