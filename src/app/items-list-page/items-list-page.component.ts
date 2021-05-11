import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../services/common.service';
import {ItemSearchFilterModel} from "../models/item-search-filter.model";
import {ItemService} from "../services/item/item-service";
import {Category} from "../models/category.model";
import {BehaviorSubject} from "rxjs";
import {ItemMetaDataModel, ItemModel} from "../models/item.model";
import firebase from "firebase";
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import Item = firebase.analytics.Item;
import {FormControl} from "@angular/forms";
import {ItemUtils} from "../utils/item-utils";

@Component({
  selector: 'app-items-list-page',
  templateUrl: './items-list-page.component.html',
  styleUrls: ['./items-list-page.component.scss']
})
export class ItemsListPageComponent implements OnInit {
  searchFilters: ItemSearchFilterModel = {} as ItemSearchFilterModel;
  categoryInfo: Category | undefined;
  filteredItemsList$: BehaviorSubject<ItemModel[]> = new BehaviorSubject<ItemModel[]>([] as ItemModel[]);
  categorySelected: string | undefined;
  constructor(public commonService: CommonService,
              private aRouter: ActivatedRoute,
              private itemService: ItemService,
              public itemUtilService: ItemUtils) { }

  ngOnInit(): void {
    this.aRouter.queryParams.subscribe((params) => {
      if (params !== undefined) {
        this.searchFilters = {
            category: params?.category,
            size: params?.size,
            saleTag: params?.saleTag,
            color: params?.color,
            name: params?.name,
            status: 200
        } as ItemSearchFilterModel;
        this.categorySelected = this.searchFilters?.category;
        this.applyFilter()
      }
    });
  }

  searchByCategory() {
    this.searchFilters = { category: this.categorySelected } as ItemSearchFilterModel;
    this.applyFilter();
  }

  applyFilter() {
    this.commonService.allCategories$.subscribe((categories) => {
      this.categoryInfo = categories.find((category) => category.slug === this.searchFilters?.category) as Category
      if (this.categoryInfo && this.searchFilters !== undefined) {
        this.searchFilters.category = this.categoryInfo?.doc?.id!;
        let itemsList: ItemModel[] = []
        this.itemService.filterItemsByCategory(this.searchFilters).subscribe((querySnapShot) => {
          querySnapShot.forEach((itemData) => {
            if (itemData.data()) {
              let itemInfo: ItemModel = {doc: {id: itemData.id }, ...itemData.data() as ItemModel};
              itemInfo.meta = this.itemUtilService.setMetaDataForItem(itemInfo)?.meta;
              itemsList.push(itemInfo);
            }
          })
          this.filteredItemsList$.next(itemsList);
        });
      }
    });
  }

}
