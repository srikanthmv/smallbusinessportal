import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemModel } from 'src/app/models/item.model';
import { UploadImageModel } from 'src/app/models/upload-image.model';
import { CommonService } from 'src/app/services/common.service';
import { ItemService } from 'src/app/services/item/item-service';
import {first, map} from "rxjs/operators";
import {nonListValidator} from "../../../utils/validators/non-list.validator";
import {ColorsModel} from "../../../models/colors.model";
import {sizeRequiredCategories} from "../../../../utils";
import {SaleTagsModel} from "../../../models/sale-tags.model";
import {BehaviorSubject} from "rxjs";
import {ImageUploadProcessModel} from "../../../models/image-upload-process.model";
import {imageSharp} from "ionicons/icons";
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
  @Output() itemAdded: EventEmitter<{id: string}> = new EventEmitter();

  itemInfoFg: FormGroup = new FormGroup({});
  editMode = false;
  colorsList: ColorsModel[] = [];
  sizeRequiredCategoryIds: string[] = [];
  discountPriceInRs: number = 0;
  selectedSaleTag: SaleTagsModel | undefined;
  itemImagesList: ImageUploadProcessModel[] = [] as ImageUploadProcessModel[];
  constructor(public commonService: CommonService, public itemService: ItemService, private fb: FormBuilder) {
    this.createFg();
  }

  ngOnInit(): void {
    this.patchImageUrls();
    this.setSystemDataUtils();
    this.formInputsValueChangesHandler();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.ItemInfo?.currentValue) {
      this.ItemInfo = changes.ItemInfo.currentValue;
      this.itemInfoFg.patchValue(this.ItemInfo!);
      this.editMode = true;
      this.itemInfoFg.updateValueAndValidity();
      this.setDiscount();
      if (Object.keys(this.ItemInfo!).length > 0) {
        this.setDefaultImagesOnLoad();
      }
    }
  }

  patchImageUrls(): void {
    this.itemImagesList.forEach((image) => {
      this.itemInfoFg.controls.additionalImages.patchValue(image?.imageUrl);
      this.itemInfoFg.controls.additionalImages.updateValueAndValidity();
    })
  }

  setDefaultImagesOnLoad() {
    if (this.ItemInfo?.additionalImages?.length) {
      this.ItemInfo?.additionalImages?.forEach((image) => {
        this.itemImagesList.push({ imageUrl: image.imageUrl,
          uploadPercentage: 100, fileName: image.fileName } as ImageUploadProcessModel)
      });
    } else {
      this.itemImagesList.push({ imageUrl: this.ItemInfo?.mainImageUrl!,
        uploadPercentage: 100, fileName: ''});
    }
  }

  setSystemDataUtils(): void {
    this.commonService.colorsList$.pipe(map((color) =>
      color.map((colorInfo) => {this.colorsList.push(colorInfo)})))
      .subscribe();
    this.commonService.allCategories$.pipe(map((categories) => {
      categories.map((category) => {
        if (sizeRequiredCategories.indexOf(category.name.toLowerCase()) > -1) {
          this.sizeRequiredCategoryIds.push(category?.doc?.id!);
        }
      })
    })).subscribe();
  }

  formInputsValueChangesHandler() {
    // if the selected category is under the size required category, user should select the item size.
    this.itemInfoFg.controls.categoryId.valueChanges.subscribe((categoryId) => {
      if (this.sizeRequiredCategoryIds.indexOf(categoryId) > -1) {
        this.itemInfoFg.controls.sizeId.setValidators([Validators.required]);
      } else {
        this.itemInfoFg.controls.sizeId.setValidators([]);
        this.itemInfoFg.controls.sizeId.setValue('');
      }
      this.itemInfoFg.controls.sizeId.updateValueAndValidity();
    })
    // when the sale offer is selected (offer type should be discount), user should enter the discount for that item.
    this.itemInfoFg.controls.saleTagId.valueChanges.subscribe((saleTag) => {
      if (saleTag) {
        this.commonService.saleTagsList$.pipe(first()).subscribe((tagsInfo) => {
          this.selectedSaleTag = tagsInfo.find((tag) => tag?.doc?.id === saleTag && tag.discountRequired)
        });
        this.itemInfoFg.controls.discount.setValidators([Validators.min(1), Validators.required]);
      } else {
        this.selectedSaleTag = undefined;
        this.itemInfoFg.controls.discount.setValidators([]);
        this.itemInfoFg.controls.discount.setValue('');
      }
      this.itemInfoFg.controls.discount.updateValueAndValidity();
    })
    this.itemInfoFg.controls.discount.valueChanges.subscribe((discount) => {
      if (discount) {
        this.setDiscount();
      } else {
        this.removeDiscount();
      }
      this.itemInfoFg.controls.discountedPrice.updateValueAndValidity();
    })
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
      brandId: [''],
      saleTagId: [''],
      additionalImages: [''],
      stockOnHand: ['', Validators.pattern('^[+]?([0-9]+(?:[\\.][0-9]*)?|\\.[0-9]+)$')],
      colorId: ['', [nonListValidator(this.colorsList, 'name')]],
      sizeId: [''],
      discount: [''],
      discountedPrice: [''],
    });
  }

  uploadItemImage(event: any): void {
    for(let fileIndex=0; fileIndex < event?.target?.files?.length; fileIndex++) {
      const initialImageUploadInfo = {imageUrl: '',uploadPercentage: 0,
        fileName: (event?.target?.files[fileIndex] as File)?.name} as ImageUploadProcessModel;
      if (this.itemImagesList.length) {
        this.itemImagesList.unshift(initialImageUploadInfo)
      } else {
        this.itemImagesList.push(initialImageUploadInfo);
      }
      const uploadImageInfo = new UploadImageModel();
      uploadImageInfo.payload = event?.target?.files[fileIndex];
      if (!this.itemImagesList[fileIndex]?.imageUrl) {
        const task = this.itemService.uploadImage(uploadImageInfo)
        task.snapshotChanges().subscribe((changes) => {
          this.itemImagesList[fileIndex].fileName = changes?.metadata?.name!;
          task.percentageChanges().subscribe((progress) => {
            this.itemImagesList[fileIndex].uploadPercentage = progress as number });
          changes?.ref.getDownloadURL().then((url) => {
            this.itemImagesList[fileIndex].imageUrl = url;
            if (!this.itemInfoFg?.controls?.mainImageUrl?.value) {
              this.setBannerImage(url);
            }
          });
        });
      }
    }
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
      this.updateAdditionalImages();
      const itemInfo: ItemModel = this.updateColorOfItem();
      this.itemService.insertItem(itemInfo).then(
        (resp) => {
          console.log(resp.id);
        this.itemInfoFg.reset();
        this.itemImagesList = [];
        this.itemAdded.emit({ id: resp?.id});
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
    if (this.itemInfoFg.valid) {
      this.updateAdditionalImages();
      const itemInfo: ItemModel = this.updateColorOfItem();
      this.itemService.updateItem(itemInfo, this.ItemInfo?.doc?.id!).then((updateResp) => {
        alert("item updated successfully")
      })
    } else {
      this.itemInfoFg.markAllAsTouched();
    }
  }

  updateColorOfItem(): ItemModel {
    const itemInfo = this.itemInfoFg.value as ItemModel;
    itemInfo.colorId = this.colorsList.find((color) =>
      color.name == this.itemInfoFg.value.colorId)?.doc?.id
    return itemInfo;
  }

  updateAdditionalImages() {
    let imagesList = this.itemImagesList.filter((images) => images?.imageUrl !== "")
    this.itemInfoFg.controls.additionalImages.setValue(imagesList);
    this.itemInfoFg.controls.additionalImages.updateValueAndValidity();
  }

  setDiscount() {
    const discount = this.itemInfoFg.controls.discount.value;
    const basePrice = this.itemInfoFg.controls.price.value;
    this.discountPriceInRs = discount * basePrice / 100;
    this.itemInfoFg.controls.discountedPrice.setValue(basePrice - this.discountPriceInRs);
  }

  removeDiscount() {
    this.discountPriceInRs = 0;
    this.itemInfoFg.controls.discountedPrice.setValue(0);
  }

  removeImage(itemName: string): void {
    this.itemService.deleteFileStorage(itemName).subscribe((resp) => {
      const fileIndex = this.itemImagesList.findIndex((image) => image.fileName === itemName)
      this.itemImagesList.splice(fileIndex,1);
    })
  }

  isBannerImage(imgUrl: string): boolean {
   return this.itemInfoFg?.controls?.mainImageUrl?.value === imgUrl
  }

  setBannerImage(imgUrl: string): void {
    this.itemInfoFg?.controls?.mainImageUrl.setValue(imgUrl);
    this.itemInfoFg.updateValueAndValidity();
  }

}
