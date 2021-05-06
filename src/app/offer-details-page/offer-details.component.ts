import { Component, OnInit } from '@angular/core';
import { OfferTagsModel } from '../models/offers-tags.model';
import { CommonService } from '../services/common.service';
import {filter, first, take} from "rxjs/operators";
import { ActivatedRoute,ParamMap } from '@angular/router';
import {map} from "rxjs/operators";
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss']
})
export class OfferDetailsComponent implements OnInit {

  offertagObject$: BehaviorSubject<OfferTagsModel> = new BehaviorSubject<OfferTagsModel>({} as OfferTagsModel);
  constructor(public commonService:CommonService, private route: ActivatedRoute) { }
 
  ngOnInit(): void {
   
      this.commonService.getOfferTagsList();
  let slug = ''
    this.route.paramMap.subscribe(params => {
    slug = String(params.get('slug'));
     
    });
    this.commonService.getoffer(slug).pipe(map((item) => {
      const itemData = item.data() as OfferTagsModel;

      return itemData;
    }))
      .subscribe((itemInfo) => {
        this.offertagObject$.next(itemInfo);
        console.log(this.offertagObject$)
      })
  

  }

 
  
  // public getOfferDetails(slug:string):void{
   
  // }

}
