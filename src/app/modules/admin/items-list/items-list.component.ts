import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import {ItemService} from "../../../services/item-service";
import {map} from "rxjs/operators";
import {ItemUtils} from "../../../utils/item-utils";
import {environment} from "../../../../environments/environment";
import {ItemModel} from "../../../models/item.model";
import {Router} from "@angular/router";
declare var gtag: Function;
@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss']
})
export class ItemsListComponent implements OnInit {
  itemIdToDelete: ItemModel | undefined;
  // @ts-ignore
  @ViewChild('DeleteItemModal', {static: true}) DeleteItemModal: ElementRef;
  constructor(public commonService: CommonService,
              public itemsService: ItemService,
              public itemUtilService: ItemUtils,
              private router: Router) { }

  ngOnInit(): void {
    this.getActiveItems();
    this.itemsService.itemsList$.pipe(map((itemInfo) => {
      const itemData = itemInfo;
      itemData.map((item) => {
        item.meta.status = this.itemUtilService.getItemStatus(item.status);
        item.meta.categoryName = this.itemUtilService.getCategoryName(item.categoryId);
        item.meta.quantityName = this.itemUtilService.getUnitName(item.baseQuantityId);
      })
      return itemData
    })).subscribe((resp) => {
      console.log(resp);
    });
  }

  getActiveItems(): void {
    this.itemsService.getStoreItems('Active');
  }

  removeImageUrl() {
    this.itemsService.itemBannerImageUrl$.next("");
  }

  editItem(itemDocId: string | undefined): void {
    if (itemDocId !== undefined) {
      this.router.navigate(['/admin/store-action'],
        {queryParams: {module: 'item', action: 'edit', id: `${itemDocId}`}}).then();
    }
  }

  markAsActiveAndInactive(itemInfo: ItemModel) {
    itemInfo.status = itemInfo.status === '200' ? '201': '200';
    const docId = itemInfo?.doc?.id;
    delete itemInfo.doc;
    this.itemsService.updateItem(itemInfo, docId!).then(() => {
      this.getActiveItems()
    })
  }

  toggleDeleteModal(action: string, item?: ItemModel) : void {
    switch (action) {
      case 'open':
        if (item !== undefined) {
          this.itemIdToDelete = item;
        }
        this.DeleteItemModal?.nativeElement.classList.add('is-active');
        break;
      case 'close':
        this.itemIdToDelete = undefined;
        if (this.DeleteItemModal?.nativeElement.classList.contains('is-active')) {
          this.DeleteItemModal?.nativeElement.classList.remove('is-active')
        }
        break;
      default:
        break;
    }
  }

  confirmDelete() {
    this.itemsService.deleteItem(this.itemIdToDelete?.doc?.id!).then(() => {
      this.toggleDeleteModal('close');
      alert('item deleted successfully');
    })
  }

}
