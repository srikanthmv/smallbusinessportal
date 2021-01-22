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
    { id: 'australian', src: 'assets/slideshow-images-af/137374204_107700014627784_1949712456850769679_o.jpg' },
    { id: 'dachshund', src: 'assets/slideshow-images-af/137538189_105039234893862_4964641684504420014_n.jpg' },
    { id: 'shiba', src: 'assets/slideshow-images-af/139639298_107871964610589_1691726782151187683_o.jpg' },
    {id: 'avs', src: 'assets/slideshow-images-af/139906964_108005237930595_5625715771528140237_o.jpg'}
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
