import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import {CommonService} from './services/common.service';
import {environment} from "../environments/environment";
import {DbCollections} from "./db/collections";
import {AccountService} from "./services/account/account.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'smallbusinessportal';
  constructor(public commonService: CommonService,
              public accountService: AccountService) {
    this.fetchConfigData();
    this.getAccountDetails();
  }

  fetchConfigData() {
    this.commonService.getAllCategories();
    [DbCollections.Brands, DbCollections.SaleTags, DbCollections.Units, DbCollections.Colors, DbCollections.Sizes]
      .forEach((collection) => {
        this.commonService.getDefaultCollections(`${collection}`);
      })
  }

  getAccountDetails() {
    this.accountService.getAccountDetails()
  }
}
