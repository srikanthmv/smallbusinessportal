import { Component, OnInit } from '@angular/core';
import {GalleryItem, ImageItem} from "ng-gallery";

@Component({
  selector: 'app-slide-show',
  templateUrl: './slide-show.component.html',
  styleUrls: ['./slide-show.component.scss']
})
export class SlideShowComponent implements OnInit {
  offerImages: GalleryItem[] | undefined;
  constructor() { }

  ngOnInit(): void {
    this.offerImages = [
      new ImageItem({ type: 'image', src: 'assets/slideshow-images-af/offer-image.jpg' })]
  }

}
