import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logoutAdmin().then(() => {
      this.router.navigate(['/admin/login']);
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
