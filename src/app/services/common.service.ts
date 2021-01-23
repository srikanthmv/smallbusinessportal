import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {Category} from '../models/category.model';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {stringToSlug} from '../../utils';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public allCategories: BehaviorSubject<Category[]> = new BehaviorSubject([] as Category[]);
  categoriesRef: AngularFirestoreCollection<Category> | undefined;
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
      this.allCategories.next(data);
      console.log(this.allCategories.getValue());
    });
  }
}
