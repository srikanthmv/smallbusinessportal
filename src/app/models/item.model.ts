import { QueryDocumentSnapshot } from "@angular/fire/firestore";

export class Item {
  doc: QueryDocumentSnapshot<any> | undefined;
  BaseQuantityId: string | undefined;
  CategoryId: string | undefined;
  Description: string | undefined;
  ImageUrl: string | undefined;
  Name: string | undefined;
  Price: string | undefined;
  Status: string | undefined;
  SubCategoryId: string | undefined;
}
