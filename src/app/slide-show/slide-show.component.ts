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
      new ImageItem({ type: 'image', src: 'assets/slideshow-images-af/137538189_105039234893862_4964641684504420014_n.jpg' }),
      new ImageItem({ type: 'image', src: 'assets/slideshow-images-af/139639298_107871964610589_1691726782151187683_o.jpg' }),
      new ImageItem({ type: 'image', src: 'assets/slideshow-images-af/139906964_108005237930595_5625715771528140237_o.jpg'})]
  }

}
