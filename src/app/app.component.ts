import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import {CommonService} from './services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'smallbusinessportal';
  constructor(public commonService: CommonService) {
    this.commonService.getAllCategories();
  }
}
