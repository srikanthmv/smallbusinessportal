import {Component, Inject, Renderer2} from "@angular/core";
import { AuthenticationService } from "src/app/services/authentication.service";
import {DOCUMENT} from "@angular/common";
import {NavigationEnd, Router} from "@angular/router";
import {environment} from "../../../environments/environment";
declare var gtag: Function;
@Component({
  selector: 'app-admin-component',
  templateUrl: 'admin.component.html'
})
export class AdminComponent {
  constructor(private authService: AuthenticationService,
              @Inject(DOCUMENT) private _document: any,
              private router: Router,
              private renderer2: Renderer2){
    this.authService.updateTokenIfUserIsAvailable();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', `${environment.GoogleAnalyticsId}`,
          {
            'page_path': event.urlAfterRedirects
          }
        );
      }
    });
  }

  ngOnInit() {
    // const s = this.renderer2.createElement('script');
    // s.type = 'text/javascript';
    // s.src = `https://www.googletagmanager.com/gtag/js?id=${environment.GoogleAnalyticsId}`; // Defines someGlobalObject
    // s.async = true;
    // s.text = ``;
    // this.renderer2.appendChild(this._document.body, s);
  }
}
