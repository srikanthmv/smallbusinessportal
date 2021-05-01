import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemModel } from 'src/app/models/item.model';
import { UploadImageModel } from 'src/app/models/upload-image.model';
import { CommonService } from 'src/app/services/common.service';
import { ItemService } from 'src/app/services/item-service';
import {map} from "rxjs/operators";
import {nonListValidator} from "../../../utils/validators/non-list.validator";
import {ColorsModel} from "../../../models/colors.model";
declare const gtag: any;
@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit, OnChanges {
  @Input() ItemInfo: ItemModel | undefined;
  @Input() TestString: string | undefined;
  @ViewChild('fileSelector') fileSelector: ElementRef<Element> | undefined;
  selectedFileName = 'no file selected';
  itemInfoFg: FormGroup = new FormGroup({});
  editMode = false;
  colorsList: ColorsModel[] = []
  constructor(public commonService: CommonService, public itemService: ItemService, private fb: FormBuilder) {
    this.createFg();
  }

  ngOnInit(): void {
    this.itemService.itemBannerImageUrl$.subscribe((imgUrl) => {
      this.itemInfoFg.controls.mainImageUrl.patchValue(imgUrl);
    });
    this.commonService.colorsList$.pipe(map((color) =>
      color.map((colorInfo) => { this.colorsList.push(colorInfo)})))
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.ItemInfo.currentValue !== undefined) {
      this.ItemInfo = changes.ItemInfo.currentValue;
      this.itemInfoFg.patchValue(this.ItemInfo!);
      this.editMode = true;
      this.itemInfoFg.updateValueAndValidity();
      this.itemService.itemBannerImageUrl$.next(this.ItemInfo?.mainImageUrl!)
    }
  }

  createFg(): void {
    this.itemInfoFg = this.fb.group({
      baseQuantityId: ['', Validators.required],
      categoryId: ['', Validators.required],
      description: ['', Validators.required],
      mainImageUrl: ['', Validators.required],
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[+]?([0-9]+(?:[\\.][0-9]*)?|\\.[0-9]+)$')]],
      status: ['', Validators.required],
      subCategoryId: [''],
      fileInput: ['', Validators.required],
      brandId: [''],
      saleTagId: [''],
      additionalImages: [''],
      stockOnHand: ['', Validators.pattern('^[+]?([0-9]+(?:[\\.][0-9]*)?|\\.[0-9]+)$')],
      colorId: ['', [nonListValidator(this.colorsList, 'name')]]
    });
  }

  uploadItemImage(event: any): void {
    this.selectedFileName = (event?.target?.files[0] as File)?.name;
    const uploadImageInfo = new UploadImageModel();
    uploadImageInfo.imageType = 400;
    uploadImageInfo.payload = event?.target?.files[0];
    this.itemService.uploadImage(uploadImageInfo);
  }

  deleteImageAndUploadNew(): void {
    this.itemService.resetImageTrackingData();
    this.selectedFileName = 'no file selected';
    this.itemInfoFg.controls.fileInput.setValue('');
  }

  isControlInvalid(formGrpName: FormGroup, controlName: string, errorKey?: string): boolean | undefined {
    let validCheck: boolean | undefined;
    if (formGrpName && controlName) {
      validCheck = (formGrpName.get(controlName)?.dirty === true || formGrpName.get(controlName)?.touched === true) &&
          formGrpName.get(controlName)?.invalid === true;
    }
    if (formGrpName && controlName && errorKey !== undefined) {
      validCheck = (formGrpName.get(controlName)?.dirty === true || formGrpName.get(controlName)?.touched === true) &&
          formGrpName.get(controlName)?.invalid === true && formGrpName.get(controlName)?.hasError(errorKey) === true;
    }
    return validCheck;
  }

  addItemToStore(): void {
    if (this.itemInfoFg.valid) {
      const itemInfo: ItemModel = this.updateColorOfItem();
      this.itemService.insertItem(itemInfo).then(
        (resp) => {
        this.itemInfoFg.reset();
        this.itemService.itemBannerImageUrl$.next('');
        alert("item added successfully");
      },
        (error) => {
          alert("Error while inserting item");
        })
    } else {
      this.itemInfoFg.markAllAsTouched();
    }
  }

  resetFormInfo(): void {
    this.itemInfoFg.reset();
  }

  updateItem() {
    const itemInfo: ItemModel = this.updateColorOfItem();
    this.itemService.updateItem(itemInfo, this.ItemInfo?.doc?.id!).then((updateResp) => {
      alert("item updated successfully")
    })
  }

  updateColorOfItem(): ItemModel {
    const itemInfo = this.itemInfoFg.value as ItemModel;
    itemInfo.colorId = this.colorsList.find((color) =>
      color.name == this.itemInfoFg.value.colorId)?.doc?.id
    return itemInfo;
  }

}
