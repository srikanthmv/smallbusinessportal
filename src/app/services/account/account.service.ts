import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {DbCollections} from "../../db/collections";
import {map} from "rxjs/operators";
import {AccountModel} from "../../models/account.model";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  accountInfo$: BehaviorSubject<AccountModel[]> = new BehaviorSubject<AccountModel[]>([] as AccountModel[]);
  constructor(private db: AngularFirestore) { }

  getAccountDetails(): void {
    this.db.collection(`${DbCollections.Accounts}`).snapshotChanges().pipe(
      map(changes =>
         changes.map(c => {
          return { doc: c.payload.doc, ...c.payload.doc.data() as AccountModel }
        })
      )
    ).subscribe(data => {
      this.accountInfo$.next(data);
    });
  }
}
