import {QueryDocumentSnapshot} from "@angular/fire/firestore";

export interface SaleTagsModel {
  doc: QueryDocumentSnapshot<any> | undefined;
  name: string | '';
  status: number | undefined;
  discountRequired: boolean;
}
