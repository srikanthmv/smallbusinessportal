import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage} from '@angular/fire/storage';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnitsModel } from '../models/units.model';
import { UploadImageModel } from '../models/upload-image.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  unitsList: BehaviorSubject<UnitsModel[]> = new BehaviorSubject([] as UnitsModel[]);
  payloadUploadProgress$: BehaviorSubject<number> = new BehaviorSubject(0);
  payloadUploadedUrl$: BehaviorSubject<string> = new BehaviorSubject('');
  constructor(private db: AngularFirestore, private afs: AngularFireStorage) {}

  getUnits(): void {
    this.db.collection('Units').snapshotChanges().pipe(
      map(changes =>
          changes.map(c =>
              ({ doc: c.payload.doc, ...c.payload.doc.data() as UnitsModel })
          )
      )
  ).subscribe(data => {
    this.unitsList.next(data);
  });
  }

  uploadImage(paylodInfo: UploadImageModel): void {
    if (paylodInfo.imageType === 400) {
      const ref = this.afs.ref(`item-images/${paylodInfo.payload?.name}${Date.now()}`);
      const task = ref.put(paylodInfo.payload);
      task.snapshotChanges().subscribe((changes) => {
        task.percentageChanges().subscribe((progress) => {this.payloadUploadProgress$.next(progress as number); });
        changes?.ref.getDownloadURL().then((url) => this.payloadUploadedUrl$.next(url));
      });
    }
  }

  resetImageTrackingData(): void {
    this.payloadUploadProgress$.next(0);
    this.payloadUploadedUrl$.next('');
  }
}
