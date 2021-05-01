import {QueryDocumentSnapshot} from "@angular/fire/firestore";

export interface ColorsModel {
  doc: QueryDocumentSnapshot<any> | undefined;
  name: string;
  status: number;
}
