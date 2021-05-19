import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomePageComponent} from './home-page/home-page.component';
import {OffersListComponent} from './offers-list/offers-list.component';
import {ItemsListPageComponent} from './items-list-page/items-list-page.component';
import { DefaultComponent } from './_layouts/default/default.component';
import { OfferDetailsComponent } from './offer-details-page/offer-details.component';
import {ItemDetailComponent} from "./item-detail/item-detail.component";
import {LoginComponent} from "./login/login.component";

const routes: Routes = [
   { path: '', component: DefaultComponent,
    children: [
      { path: '', component: HomePageComponent, pathMatch: 'full'},
      { path: 'offers', component: OffersListComponent,},
      {
        path:'offers/:slug',component:OfferDetailsComponent,pathMatch:'full'
      },
      { path: 'items-list', component: ItemsListPageComponent},
      { path: 'item/:id', component: ItemDetailComponent},
      { path: 'login', component: LoginComponent}
    ]
  },
  { path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)},
  { path: '*', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
