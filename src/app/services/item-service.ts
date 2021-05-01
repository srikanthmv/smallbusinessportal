import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage} from '@angular/fire/storage';
import {BehaviorSubject, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { UnitsModel } from '../models/units.model';
import { UploadImageModel } from '../models/upload-image.model';
import {DocumentReference} from "@angular/fire/firestore/interfaces";
import {ItemMetaDataModel, ItemModel} from "../models/item.model";
import {ItemUtils} from "../utils/item-utils";
import firebase from "firebase";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  itemBannerImageUploadProgress$: BehaviorSubject<number> = new BehaviorSubject(0);
  itemBannerImageUrl$: BehaviorSubject<string> = new BehaviorSubject('');
  itemsList$: BehaviorSubject<ItemModel[]> = new BehaviorSubject([] as ItemModel[]);
  constructor(private db: AngularFirestore, private afs: AngularFireStorage) {}

  uploadImage(paylodInfo: UploadImageModel): void {
    if (paylodInfo.imageType === 400) {
      const ref = this.afs.ref(`item-images/${paylodInfo.payload?.name}${Date.now()}`);
      const task = ref.put(paylodInfo.payload);
      task.snapshotChanges().subscribe((changes) => {
        task.percentageChanges().subscribe((progress) => {this.itemBannerImageUploadProgress$.next(progress as number); });
        changes?.ref.getDownloadURL().then((url) => this.itemBannerImageUrl$.next(url));
      });
    }
  }

  insertItem(itemInfo: any) {
    return this.db.collection('Items').add(itemInfo) as Promise<DocumentReference>;
  }

  updateItem(itemInfo: ItemModel, docId: string) {
    return this.db.collection('Items').doc(`${docId}`).update(itemInfo);
  }

  deleteItem(docId: string) {
    return this.db.collection('Items').doc(`${docId}`).delete();
  }

  getItem(itemDocId: string): Observable<DocumentSnapshot<any>> {
    const itemRef = this.db.collection('Items').doc(`${itemDocId}`)
    return itemRef.get();
  }

  resetImageTrackingData(): void {
    this.itemBannerImageUploadProgress$.next(0);
    this.itemBannerImageUrl$.next('');
  }

  getStoreItems(status: 'Active'| 'Inactive'): void {
    this.db.collection('Items').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => {
          return { doc: c.payload.doc, meta: {} as ItemMetaDataModel, ...c.payload.doc.data() as ItemModel }
        })
      )
    ).subscribe(data => {
      this.itemsList$.next(data);
    });
  }
}
