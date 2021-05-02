import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {ItemService} from "../../../services/item/item-service";
import {BehaviorSubject, Observable} from "rxjs";
import {ItemModel} from "../../../models/item.model";
import {map} from "rxjs/operators";
import {QueryDocumentSnapshot} from "@angular/fire/firestore";
import {ItemUtils} from "../../../utils/item-utils";
import {ColorsModel} from "../../../models/colors.model";
import {CommonService} from "../../../services/common.service";
import {sizeRequiredCategories} from "../../../../utils";
import {Category} from "../../../models/category.model";
import {SizesModel} from "../../../models/sizes.model";
import {VariantsModel} from "../../../models/variants.model";
import firebase from "firebase";
import Item = firebase.analytics.Item;

@Component({
  selector: 'app-store-tasks',
  templateUrl: './store-tasks.component.html',
  styleUrls: ['./store-tasks.component.scss']
})
export class StoreTasksComponent implements OnInit {
  actionItemInfo: Params = {} as Params;
  itemInserted = false;
  editableItemInfo$: BehaviorSubject<ItemModel> = new BehaviorSubject<ItemModel>({} as ItemModel);
  recentlyAddedItemInfo$: BehaviorSubject<ItemModel> = new BehaviorSubject<ItemModel>({} as ItemModel);
  itemCombinationsList$: BehaviorSubject<ItemModel[]> = new BehaviorSubject<ItemModel[]>([] as ItemModel[]);
  variantsList: VariantsModel[] = [] as VariantsModel[];
  variantsSelectedList: ItemModel[] = [] as ItemModel[];
  createdVariantsCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(private aRouter: ActivatedRoute, private router: Router,
              private itemService: ItemService, private itemUtilService: ItemUtils,
              private commonService: CommonService) {
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

  itemAddedEventHandler(eventData: {id: string | undefined}): void {
    if (eventData.id !== undefined) {
      this.itemService.getItem(eventData.id).subscribe((itemInfo) => {
        this.recentlyAddedItemInfo$.next(itemInfo.data() as ItemModel);
        this.itemInserted = true;
        this.recentlyAddedItemInfo$.subscribe((itemData) => {
          this.generateItemVariants(itemData);
        })
      })
    }
  }

  generateItemVariants(itemInfo: ItemModel): void {
    /*
    filter out the available combinations of colors and sizes(if item has already got the size selected) and
    generate the available combinations.
     */
    let availableColors: ColorsModel[] = [] as ColorsModel[];
    let availableSizes: SizesModel[] = [] as SizesModel[];
    this.commonService.colorsList$.pipe(map((colors) => {
      availableColors = colors.filter((color) => color?.doc?.id !== itemInfo?.colorId)
    })).subscribe();
    if (itemInfo?.sizeId) {
     this.commonService.sizesList$.pipe(map((sizes) => {
       availableSizes = sizes.filter((size) => size?.doc?.id !== itemInfo?.sizeId)
      })).subscribe()
    }

    // finding variants when both color and sizes are available
    if (availableSizes.length && availableColors.length) {
      availableColors.forEach((color) => {
        availableSizes.forEach((size) => {
          this.variantsList.push({ color: color.name, size: size.name, colorDoc: color.doc!, sizeDoc: size.doc!})
        })
      })
    }

    // generate color only combinations
    if (availableColors.length && !availableSizes.length) {
      availableColors.forEach((colors) => {
        this.variantsList.push({color: colors.name, colorDoc: colors?.doc!} as VariantsModel)
      })
    }

    if (this.variantsList.length) {
      let itemsList: ItemModel[] = [] as ItemModel[];
      this.variantsList.forEach((variantInfo) => {
        if (variantInfo.color) {
          const itemData = {...itemInfo, colorId: variantInfo?.colorDoc?.id} as ItemModel
          itemsList.push(itemData);
        }
        if (variantInfo.size) {
          const itemData = {...itemInfo, sizeId: variantInfo?.sizeDoc?.id} as ItemModel
          itemsList.push(itemData);
        }
      })
      this.itemCombinationsList$.next(itemsList);
    }
  }

  getItemColorLabel(item: ItemModel | undefined): string {
    return this.itemUtilService.getColorName(item?.colorId);
  }

  getItemSizeLabel(item: ItemModel | undefined): string {
    return this.itemUtilService.getSizeName(item?.sizeId);
  }

  manageVariantsListItem(selectedItem: ItemModel, event: any): void {
    if (event?.target?.checked) {
      this.variantsSelectedList.push(selectedItem);
    } else {
      const itemIndex = this.variantsSelectedList.findIndex(item => item.colorId === selectedItem.colorId &&
        item.sizeId === selectedItem.sizeId && item.name === selectedItem.name);
      if (itemIndex > 0) {
        this.variantsSelectedList = this.variantsSelectedList.splice(itemIndex,1);
      }
    }
  }

  selectOrDeselectAllItems(event: any): void {
    switch (event.target.checked) {
      case true:
        this.variantsSelectedList = this.itemCombinationsList$.getValue();
        break;
      case false:
        this.variantsSelectedList = [];
        break
    }
  }

  proceedToCreateItems() {
    this.itemCombinationsList$.next([]);
    this.variantsSelectedList.forEach((variant) => {
      this.itemService.insertItem(variant).then((resp) => {
        this.createdVariantsCount.next(this.createdVariantsCount.getValue() + 1)
      })
    })
  }
}
