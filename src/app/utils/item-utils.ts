import {CommonService} from "../services/common.service";
import {ItemService} from "../services/item/item-service";
import {filter, first, take} from "rxjs/operators";
import {UnitsModel} from "../models/units.model";
import {Category} from "../models/category.model";
import {Injectable} from "@angular/core";
import {ColorsModel} from "../models/colors.model";
import {SizesModel} from "../models/sizes.model";
import {ItemMetaDataModel, ItemModel} from "../models/item.model";
import {SaleTagsModel} from "../models/sale-tags.model";

@Injectable({
  providedIn: 'root'
})
export class ItemUtils {
  constructor(private commonService: CommonService) {
  }

  public getUnitName(unitId: string | undefined): string {
    let unitsInfo: UnitsModel = new UnitsModel();
    if (unitId == undefined) {
      return  ''
    }
    this.commonService.unitsList$.pipe(take(1)).subscribe((unitInfo) => {
      unitsInfo = unitInfo.find((unit) => unit?.doc?.id === unitId) as UnitsModel;
    })
    return unitsInfo?.name || '';
  }

  getCategoryName(categoryId: string | undefined): string {
    let categoryInfo: Category = new Category();
    this.commonService.allCategories$.pipe(take(1)).subscribe((categories) => {
      categoryInfo = categories.find((category) => category?.doc?.id === categoryId) as Category;
    })
    return categoryInfo?.name || '';
  }

  getColorName(colorId: string | undefined): string {
    let colorsInfo: ColorsModel = {} as ColorsModel;
    this.commonService.colorsList$.pipe(take(1)).subscribe((colors) => {
      colorsInfo = colors.find((color) => color?.doc?.id === colorId) as ColorsModel;
    })
    return colorsInfo?.name || '';
  }

  getSizeName(sizeId: string | undefined): string {
    let sizeInfo: ColorsModel = {} as SizesModel;
    this.commonService.sizesList$.pipe(take(1)).subscribe((sizes) => {
      sizeInfo = sizes.find((size) => size?.doc?.id === sizeId) as SizesModel;
    })
    return sizeInfo?.name || '';
  }

  getSaleTagName(saleTagId: string | undefined): string {
    let saleTagInfo : SaleTagsModel = {} as SaleTagsModel;
    this.commonService.saleTagsList$.pipe(take(1)).subscribe((saleTags) => {
      saleTagInfo = saleTags.find((tag) => tag?.doc?.id === saleTagId) as SaleTagsModel;
    })
    return saleTagInfo?.name || '';
  }

  getItemStatus(statusCode: string): string {
    switch (statusCode) {
      case '200':
        return 'active';
      case '201':
        return 'inactive';
      default:
        return '';
    }
  }

  public setMetaDataForItem(item: ItemModel): ItemModel {
    item.meta = { categoryName: '', subCategoryName:'', saleTagName: '',
      status: '', color: '', quantityName: '', size: '' } as ItemMetaDataModel;
    item.meta.status = this.getItemStatus(item.status);
    item.meta.categoryName = this.getCategoryName(item.categoryId);
    item.meta.quantityName = this.getUnitName(item.baseQuantityId);
    item.meta.size = this.getSizeName(item.sizeId);
    item.meta.color = this.getColorName(item.colorId);
    item.meta.saleTagName = this.getSaleTagName(item.saleTagId);
    return item;
  }
}
