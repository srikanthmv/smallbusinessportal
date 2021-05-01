import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import {CommonService} from './services/common.service';
import {environment} from "../environments/environment";
import {DbCollections} from "./utils/collections";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'smallbusinessportal';
  constructor(public commonService: CommonService) {
    this.fetchConfigData();
  }

  fetchConfigData() {
    this.commonService.getAllCategories();
    [DbCollections.Brands, DbCollections.SaleTags, DbCollections.Units, DbCollections.Colors]
      .forEach((collection) => {
        this.commonService.getDefaultCollections(`${collection}`);
      })
  }
}
