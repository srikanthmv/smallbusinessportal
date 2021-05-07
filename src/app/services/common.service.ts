import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {Category} from '../models/category.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {stringToSlug} from '../../utils';
import {UnitsModel} from "../models/units.model";
import {BrandsModel} from "../models/brands.model";
import {SaleTagsModel} from "../models/sale-tags.model";
import {OfferTagsModel} from "../models/offers-tags.model";
import {DbCollections} from "../db/collections";
import {ColorsModel} from "../models/colors.model";
import firebase from "firebase";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import {SizesModel} from "../models/sizes.model";

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  unitsList$: BehaviorSubject<UnitsModel[]> = new BehaviorSubject([] as UnitsModel[]);
  public brandsList$: BehaviorSubject<BrandsModel[]> = new BehaviorSubject([] as BrandsModel[]);
  public saleTagsList$: BehaviorSubject<SaleTagsModel[]> = new BehaviorSubject([] as SaleTagsModel[]);
  public allCategories$: BehaviorSubject<Category[]> = new BehaviorSubject([] as Category[]);
  public offerObject$: BehaviorSubject<OfferTagsModel[]> = new BehaviorSubject([] as OfferTagsModel[]);
  public offerTagsList$: BehaviorSubject<OfferTagsModel[]> = new BehaviorSubject([] as OfferTagsModel[]);
  public colorsList$: BehaviorSubject<ColorsModel[]> =
    new BehaviorSubject<ColorsModel[]>([] as ColorsModel[]);
  public sizesList$: BehaviorSubject<SizesModel[]> = new BehaviorSubject([] as SizesModel[]);
  constructor(private db: AngularFirestore) {
  }

  public getAllCategories(): void {
    // @ts-ignore
    // @ts-ignore
    this.db.collection('Categories').snapshotChanges().pipe(
        map(changes =>
            changes.map(c =>
                ({ doc: c.payload.doc, ...c.payload.doc.data() as Category })
            ).map((categoryInfo) => {
              // @ts-ignore
              return ({slug: stringToSlug(categoryInfo.name), ...categoryInfo});
            })
        )
    ).subscribe(data => {
      this.allCategories$.next(data);
    });
  }


  public getOfferTagsList(): void {
    // @ts-ignore
    // @ts-ignore
    this.db.collection('OfferTags').snapshotChanges().pipe(
        map(changes =>
            changes.map(c =>
                ({ doc: c.payload.doc, ...c.payload.doc.data() as OfferTagsModel })
            ).map((offerInfo) => {
              // @ts-ignore
              return ({slug: stringToSlug(offerInfo.name), ...offerInfo});
            })
        )
    ).subscribe(data => {
      this.offerTagsList$.next(data);
    });
  }

  getoffer(docId:string): Observable<DocumentSnapshot<any>> {
    const itemRef = this.db.collection('OfferTags').doc(`${docId}`)
    console.log(itemRef.get())
    return itemRef.get();
  }


  getDefaultCollections(collectionName: string): void {
    this.db.collection(`${collectionName}`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => {
          switch(collectionName) {
            case DbCollections.Units:
              return { doc: c.payload.doc, ...c.payload.doc.data() as UnitsModel }
            case DbCollections.Brands:
              return { doc: c.payload.doc, ...c.payload.doc.data() as BrandsModel }
            case DbCollections.SaleTags:
              return { doc: c.payload.doc, ...c.payload.doc.data() as SaleTagsModel }
            case DbCollections.Colors:
              return { doc: c.payload.doc, ...c.payload.doc.data() as ColorsModel }
            case DbCollections.Sizes:
              return { doc: c.payload.doc, ...c.payload.doc.data() as SizesModel}
            default:
              return {}
          }
        })
      )
    ).subscribe(data => {
      switch (collectionName) {
        case DbCollections.Units:
          this.unitsList$.next(data as UnitsModel[]);
          break;
        case DbCollections.Brands:
          this.brandsList$.next(data as BrandsModel[]);
          break;
        case DbCollections.SaleTags:
          this.saleTagsList$.next(data as SaleTagsModel[]);
          break;
        case DbCollections.Colors:
          this.colorsList$.next(data as ColorsModel[]);
          break;
        case DbCollections.Sizes:
          this.sizesList$.next(data as SizesModel[]);
          break;
        default:
          break;
      }
    });}
}
