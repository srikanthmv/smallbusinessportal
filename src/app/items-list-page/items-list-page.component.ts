import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../services/common.service';

@Component({
  selector: 'app-items-list-page',
  templateUrl: './items-list-page.component.html',
  styleUrls: ['./items-list-page.component.scss']
})
export class ItemsListPageComponent implements OnInit {
  itemCategoryName = '';
  constructor(public commonService: CommonService, private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.params.subscribe((param) => {
      this.itemCategoryName = param.category.toString();
    });
  }

}
