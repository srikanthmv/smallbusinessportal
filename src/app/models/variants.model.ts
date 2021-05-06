import {QueryDocumentSnapshot} from "@angular/fire/firestore";

export interface VariantsModel {
  color: string;
  colorDoc: QueryDocumentSnapshot<any>;
  size: string;
  sizeDoc: QueryDocumentSnapshot<any>;
}
