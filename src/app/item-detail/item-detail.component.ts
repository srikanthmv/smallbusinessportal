import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ItemService} from "../services/item/item-service";
import {BehaviorSubject, Subject} from "rxjs";
import {ItemModel} from "../models/item.model";
import {map} from "rxjs/operators";
import {ItemUtils} from "../utils/item-utils";
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {
  itemDetails$: BehaviorSubject<ItemModel> = new BehaviorSubject<ItemModel>({} as ItemModel);
  isMobileView = false;
  constructor(private activatedRoute: ActivatedRoute,
              private itemService: ItemService,
              private itemUtilService: ItemUtils,
              private breakpointObserver: BreakpointObserver) {
    this.activatedRoute.params.subscribe((param) => {
      if (param?.id) {
        this.getItemInfo(param?.id);
      }
    })
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((breakpoint) => {
      this.isMobileView = breakpoint.matches
    })
  }

  ngOnInit(): void {
  }

  getItemInfo(id: string) {
    if (!id) {
      return;
    }
    this.itemService.getItem(id).pipe(map((item) => {
      const newDoc = {id: id};
      const itemData = item.data() as ItemModel;
      itemData.meta = this.itemUtilService.setMetaDataForItem(itemData).meta;
      return {doc: newDoc, ...itemData} as ItemModel;
    }))
      .subscribe((itemInfo) => {
        this.itemDetails$?.next(itemInfo);
      })
  }

}
