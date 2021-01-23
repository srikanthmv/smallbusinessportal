import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UploadImageModel } from 'src/app/models/upload-image.model';
import { CommonService } from 'src/app/services/common.service';
import { ItemService } from 'src/app/services/item-service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
  @Input() ItemInfo: any;
  @ViewChild('fileSelector') fileSelector: ElementRef<Element> | undefined;
  selecteddFileName = 'no file selected';
  constructor(public commonService: CommonService, public itemService: ItemService) { }

  ngOnInit(): void {
    this.itemService.getUnits();
  }

  uploadItemImage(event: any) {
    const fileInfo: File = event?.target?.files[0] as File;
    this.selecteddFileName = fileInfo.name;
    let image = new Image();
    image = event?.target?.files[0];
    const uploadImageInfo = new UploadImageModel()
    uploadImageInfo.imageType = 400;
    uploadImageInfo.payload = event?.target?.files[0];
    this.itemService.uploadImage(uploadImageInfo);
  }

  deleteImageAndUploadNew() {
    this.itemService.resetImageTrackingData();
    this.selecteddFileName = 'no file selected'
  }

}
