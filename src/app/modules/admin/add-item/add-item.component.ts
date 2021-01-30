import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Item } from 'src/app/models/item.model';
import { UploadImageModel } from 'src/app/models/upload-image.model';
import { CommonService } from 'src/app/services/common.service';
import { ItemService } from 'src/app/services/item-service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
  @Input() ItemInfo: Item | undefined;
  @ViewChild('fileSelector') fileSelector: ElementRef<Element> | undefined;
  selecteddFileName = 'no file selected';
  itemInfoFg: FormGroup = new FormGroup({});
  constructor(public commonService: CommonService, public itemService: ItemService, private fb: FormBuilder) {
    this.createFg();
  }

  ngOnInit(): void {
    this.itemService.getUnits();
    if (this.ItemInfo !== undefined) {
      this.itemInfoFg.patchValue(this.ItemInfo);
    }
    this.itemService.payloadUploadedUrl$.subscribe((imgUrl) => {
      this.itemInfoFg.controls.imageUrl.patchValue(imgUrl);
    });
  }

  createFg(): void {
    this.itemInfoFg = this.fb.group({
      baseQuantityId: ['', Validators.required],
      categoryId: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
      itemName: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[+]?([0-9]+(?:[\\.][0-9]*)?|\\.[0-9]+)$')]],
      status: ['', Validators.required],
      subCategoryId: [''],
      fileInput: ['', Validators.required]
    });
  }

  uploadItemImage(event: any): void {
    this.selecteddFileName = (event?.target?.files[0] as File)?.name;
    const uploadImageInfo = new UploadImageModel();
    uploadImageInfo.imageType = 400;
    uploadImageInfo.payload = event?.target?.files[0];
    this.itemService.uploadImage(uploadImageInfo);
  }

  deleteImageAndUploadNew(): void {
    this.itemService.resetImageTrackingData();
    this.selecteddFileName = 'no file selected';
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
      console.log(this.itemInfoFg.value);
    } else {
      this.itemInfoFg.markAllAsTouched();
    }
  }

  resetFormInfo(): void {
    this.itemInfoFg.reset();
  }

}
