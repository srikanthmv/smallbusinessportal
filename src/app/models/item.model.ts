import { QueryDocumentSnapshot } from "@angular/fire/firestore";
import {ImageUploadProcessModel} from "./image-upload-process.model";

export interface ItemModel {
  doc: QueryDocumentSnapshot<any> | undefined;
  baseQuantityId: string;
  categoryId: string;
  description: string;
  mainImageUrl: string;
  name: string;
  price: string;
  status: string;
  subCategoryId: string;
  stockOnHand: number | undefined;
  colorId: string | undefined;
  sizeId: string | undefined;
  additionalImages: ImageUploadProcessModel[];
  meta?: ItemMetaDataModel | any;
}

export interface ItemMetaDataModel {
  categoryName: string;
  subCategoryName: string;
  status: string;
  quantityName: string;
  size: string;
  color: string;
}
