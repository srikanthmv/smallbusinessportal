import {QueryDocumentSnapshot} from "@angular/fire/firestore";

export interface AccountModel {
  doc: QueryDocumentSnapshot<any> | undefined;
  GST: string;
  location: string;
  logo: string;
  name: string;
  status: number;
  supportMail: string;
}
