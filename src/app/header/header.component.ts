import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import {CommonService} from '../services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [
      './header.component.scss'
  ]
})
export class HeaderComponent implements OnInit {
  userLoggedIn: boolean | undefined;
  constructor(public commonService: CommonService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.userLoggedIn = this.authService.isUserLoggedIn();
  }

}
