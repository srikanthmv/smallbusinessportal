import { QueryDocumentSnapshot } from "@angular/fire/firestore";

export class UnitsModel {
  doc: QueryDocumentSnapshot<any> | undefined;
  docId = '';
  name = '';
}
