import {QueryDocumentSnapshot} from "@angular/fire/firestore";
import {Timestamp} from "rxjs/internal/operators/timestamp";

export class OfferTagsModel {
  doc: QueryDocumentSnapshot<any> | undefined;
  name = '';
  status = '';
  description = '';
  slug = '';
  bannerImageUrl = '';
  start: any | undefined;
  end: any | undefined;
}
