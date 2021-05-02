import { QueryDocumentSnapshot } from "@angular/fire/firestore";

export class ItemModel {
  doc: QueryDocumentSnapshot<any> | undefined;
  baseQuantityId: string = '';
  categoryId: string = '';
  description: string  = '';
  mainImageUrl: string  = '';
  name: string  = '';
  price: string  = '';
  status: string  = '';
  subCategoryId: string  = '';
  stockOnHand: number | undefined;
  colorId: string | undefined;
  sizeId: string | undefined;
  additionalImages: string[] = [];
  meta?: ItemMetaDataModel | any;
}

export class ItemMetaDataModel {
  categoryName: string  = '';
  subCategoryName: string  = '';
  status: string  = '';
  quantityName: string  = '';
  size: string = '';
  color: string = '';
}
