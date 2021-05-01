import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {ItemService} from "../../../services/item-service";
import {BehaviorSubject, Observable} from "rxjs";
import {ItemModel} from "../../../models/item.model";
import {map} from "rxjs/operators";
import {QueryDocumentSnapshot} from "@angular/fire/firestore";
import {ItemUtils} from "../../../utils/item-utils";

@Component({
  selector: 'app-store-tasks',
  templateUrl: './store-tasks.component.html',
  styleUrls: ['./store-tasks.component.scss']
})
export class StoreTasksComponent implements OnInit {
  actionItemInfo: Params = {} as Params;
  editableItemInfo$: BehaviorSubject<ItemModel> = new BehaviorSubject<ItemModel>({} as ItemModel);
  constructor(private aRouter: ActivatedRoute, private router: Router,
              private itemService: ItemService, private itemUtilService: ItemUtils) {
  }

  ngOnInit(): void {
    this.aRouter.queryParams.subscribe((params) => {
      if (params !== undefined) {
        this.actionItemInfo = params;
        this.mapItemDetails();
      } else{
        this.router.navigate(['/admin/dashboard']).then();
      }
    })
  }

  mapItemDetails() {
    if (this.actionItemInfo?.module === 'item' &&
      this.actionItemInfo?.action === 'edit' &&
      this.actionItemInfo?.id) {
      this.itemService.getItem(this.actionItemInfo?.id).pipe(map((item) => {
        const newDoc = {id: this.actionItemInfo?.id};
        const itemData = item.data() as ItemModel;
        itemData.colorId = this.itemUtilService.getColorName(itemData.colorId);
        return {doc: newDoc, ...itemData} as ItemModel;
      }))
        .subscribe((itemInfo) => {
          this.editableItemInfo$.next(itemInfo);
        })
    }
  }
}
