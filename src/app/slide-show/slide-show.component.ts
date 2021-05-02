import { Component, OnInit } from '@angular/core';
import { CarouselImage, CarouselController } from 'ng-simple-carousel';

@Component({
  selector: 'app-slide-show',
  templateUrl: './slide-show.component.html',
  styleUrls: ['./slide-show.component.scss']
})
export class SlideShowComponent implements OnInit {
  controllerButton = new CarouselController();
  images: CarouselImage[] = [
    { id: 'australian', src: 'https://download-accl.zoho.com/webdownload?x-service=CLIQ&event-id=0e17e076835b478c3ae33ddb3d3408e287da5ac4cb76dbb4938647a2a97451d3196384cae51a893c5f4d16704b9ce4265d7c4dd1d2fdf82a4d59b531c364c45c' },
    { id: 'dachshund', src: 'assets/slideshow-images-af/137538189_105039234893862_4964641684504420014_n.jpg' },
    { id: 'shiba', src: 'assets/slideshow-images-af/139639298_107871964610589_1691726782151187683_o.jpg' },
    {id: 'avs', src: 'assets/slideshow-images-af/139906964_108005237930595_5625715771528140237_o.jpg'}
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
