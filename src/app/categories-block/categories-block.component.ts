import { Component, OnInit } from '@angular/core';
import {CommonService} from "../services/common.service";

@Component({
  selector: 'app-categories-block',
  templateUrl: './categories-block.component.html',
  styleUrls: ['./categories-block.component.scss']
})
export class CategoriesBlockComponent implements OnInit {

  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
  }

}
