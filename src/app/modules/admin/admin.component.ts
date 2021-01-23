import { Component } from "@angular/core";
import { AuthenticationService } from "src/app/services/authentication.service";

@Component({
  selector: 'app-admin-component',
  templateUrl: 'admin.component.html'
})
export class AdminComponent {
  constructor(private authService: AuthenticationService){
    this.authService.updateTokenIfUserIsAvailable();
  }
}
