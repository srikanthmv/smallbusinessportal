import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-store-tasks',
  templateUrl: './store-tasks.component.html',
  styleUrls: ['./store-tasks.component.scss']
})
export class StoreTasksComponent implements OnInit {
  actionItemInfo: Params = {} as Params;
  constructor(private aRouter: ActivatedRoute, private router: Router) {
    this.aRouter.queryParams.subscribe((params) => {
       if (params !== undefined) {
         this.actionItemInfo = params;
       } else{
         this.router.navigate(['/admin/dashboard']);
       }
    })
  }

  ngOnInit(): void {
    if (this.actionItemInfo?.module === 'item' && this.actionItemInfo?.action === 'edit') {
      // get item details using item-id;
  }

}
}
