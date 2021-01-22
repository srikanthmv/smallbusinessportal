import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomePageComponent} from '../../home-page/home-page.component';
import {OffersListComponent} from '../../offers-list/offers-list.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import { LoginComponent } from 'src/app/login/login.component';
import { LoginAuthGuardCheck } from 'src/app/guards/login-auth-check.guard';
import { AuthTokenCheckGuard } from 'src/app/guards/auth-token-check.guard';
import { ItemsListComponent } from './items-list/items-list.component';
import { AdminComponent } from './admin.component';

const routes: Routes = [
    {path: '', component: AdminComponent,
    children: [
      {path: 'dashboard', component: DashboardComponent},
      {path: 'items-list', component: ItemsListComponent}
    ]},
    {path: 'login', component: LoginComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdminRoutes {
    constructor() {
        debugger
    }
}
