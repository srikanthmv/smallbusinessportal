import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage} from '@angular/fire/storage';
import {BehaviorSubject, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { UnitsModel } from '../../models/units.model';
import { UploadImageModel } from '../../models/upload-image.model';
import {DocumentReference} from "@angular/fire/firestore/interfaces";
import {ItemMetaDataModel, ItemModel} from "../../models/item.model";
import {ItemUtils} from "../../utils/item-utils";
import firebase from "firebase";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import {ItemSearchFilterModel} from "../../models/item-search-filter.model";
import {DbCollections} from "../../db/collections";
import {AngularFireUploadTask} from "@angular/fire/storage/task";
import {UploadTaskSnapshot} from "@angular/fire/storage/interfaces";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private basePath = '/item-images';
  itemsList$: BehaviorSubject<ItemModel[]> = new BehaviorSubject([] as ItemModel[]);
  constructor(private db: AngularFirestore, private afs: AngularFireStorage) {}

  uploadImage(payloadInfo: UploadImageModel): AngularFireUploadTask {
    const ref = this.afs.ref(`item-images/${Date.now()}_${payloadInfo.payload?.name}`);
    return ref.put(payloadInfo.payload) as AngularFireUploadTask;
  }

  deleteFileStorage(name: string): Observable<any> {
    return this.afs.ref(`${this.basePath}/${name}`).delete() as Observable<any>;
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
