import {QueryDocumentSnapshot} from "@angular/fire/firestore";

export interface SizesModel {
  doc: QueryDocumentSnapshot<any> | undefined;
  name: string;
  status: number;
  style: string;
  label: string;
}
