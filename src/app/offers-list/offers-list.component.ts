import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-offers-list',
  templateUrl: './offers-list.component.html',
  styleUrls: ['./offers-list.component.scss']
})
export class OffersListComponent implements OnInit {

  constructor(public commonService:CommonService) { }

  ngOnInit(): void {
    this.commonService.getOfferTagsList();
  }
  isListShow = true;
  isDetailsShow = false;

  getDetails(slug:string){
    this.isDetailsShow = true;
    this.isListShow = false;
    
  }

}
