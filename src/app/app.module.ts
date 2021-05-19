import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SlideShowComponent } from './slide-show/slide-show.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CategoriesBlockComponent } from './categories-block/categories-block.component';
import { OffersListComponent } from './offers-list/offers-list.component';
import { OfferDetailsComponent } from './offer-details-page/offer-details.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { ItemsListPageComponent } from './items-list-page/items-list-page.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import {environment} from '../environments/environment';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { DefaultComponent } from './_layouts/default/default.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { GalleryModule} from "ng-gallery";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SlideShowComponent,
    HomePageComponent,
    CategoriesBlockComponent,
    OffersListComponent,
    OfferDetailsComponent,
    TestimonialsComponent,
    ItemsListPageComponent,
      AdminLoginComponent,
      DefaultComponent,
      ItemDetailComponent,
      LoginComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireDatabaseModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        GalleryModule
    ],
  providers: [AngularFireStorage],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor() {
  }
}
