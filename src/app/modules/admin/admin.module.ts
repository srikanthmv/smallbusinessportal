import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ItemsListComponent } from './items-list/items-list.component';
import { OffersListComponent } from './offers-list/offers-list.component';
import { FeedbackBoardComponent } from './feedback-board/feedback-board.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminRoutes } from './admin.routes';
import { AdminComponent } from './admin.component';
import { AddItemComponent } from './add-item/add-item.component';
import { StoreTasksComponent } from './store-tasks/store-tasks.component';



@NgModule({
  declarations: [DashboardComponent,
    SidenavComponent,
    ItemsListComponent,
    OffersListComponent,
    FeedbackBoardComponent,
    AdminHeaderComponent,
    AdminComponent,
    AddItemComponent,
    StoreTasksComponent],
  imports: [
    CommonModule,
    AdminRoutes
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule { }
