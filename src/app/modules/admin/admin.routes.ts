import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomePageComponent} from '../../home-page/home-page.component';
import {OffersListComponent} from '../../offers-list/offers-list.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import { AdminLoginComponent } from 'src/app/admin-login/admin-login.component';
import { LoginAuthGuardCheck } from 'src/app/guards/login-auth-check.guard';
import { AuthTokenCheckGuard } from 'src/app/guards/auth-token-check.guard';
import { ItemsListComponent } from './items-list/items-list.component';
import { AdminComponent } from './admin.component';
import { AddItemComponent } from './add-item/add-item.component';
import { StoreTasksComponent } from './store-tasks/store-tasks.component';

const routes: Routes = [
    {path: '', component: AdminComponent,
    children: [
      {path: 'dashboard', component: DashboardComponent},
      {path: 'items-list', component: ItemsListComponent},
      {path: 'store-action', component: StoreTasksComponent}
    ]},
    {path: 'admin-login', component: AdminLoginComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdminRoutes {
}
