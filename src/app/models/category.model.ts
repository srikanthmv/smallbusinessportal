import { QueryDocumentSnapshot } from "@angular/fire/firestore";

export class Category {
    doc: QueryDocumentSnapshot<any> | undefined;
    name = '';
    status = '';
    slug = '';
}
