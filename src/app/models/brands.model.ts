import {QueryDocumentSnapshot} from "@angular/fire/firestore";

export interface BrandsModel {
  doc: QueryDocumentSnapshot<any> | undefined;
  name: string | '';
  status: number | 0;
}
