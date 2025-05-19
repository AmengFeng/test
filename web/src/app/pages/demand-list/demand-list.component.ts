import { Component, Input, inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DemandService } from '../../services/demand.service';
import { BaseHttpService } from '../../services/http/base-http.service';
import { ShareModule } from '../../share.module';
import { DemandCardComponent } from '../../components/demand-card/demand-card.component';
import { NewDemandComponent } from '../../components/new-demand/new-demand.component';
import { WindowService } from '../../services/window.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-demand-list',
  standalone: true,
  imports: [ShareModule, DemandCardComponent],
  providers: [DemandService],
  templateUrl: './demand-list.component.html',
  styleUrl: './demand-list.component.scss',
})
export class DemandListComponent {
  windowService = inject(WindowService);
  msg = inject(NzMessageService);
  http = inject(BaseHttpService);
  demandService = inject(DemandService);
  route = inject(ActivatedRoute);
  @Input() userId?: string | number;
  @Input() readOnly: boolean = true;
  demands: any = [];
  demandCount = 0;
  searchTerm?: string;
  pageIndex = 1;

  getDemands() {
    return this.http.get('/demand/', {
      page: this.pageIndex,
      search: this.searchTerm,
      creator__id: this.userId,
    });
  }

  search() {
    this.pageIndex = 1;
    this.getDemands().subscribe((res: any) => {
      console.log(res);
      this.demands = res.results;
      this.demandCount = res.count;
    });
  }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        switchMap((params) => {
          this.readOnly = params['readOnly'] !== 'false';
          console.log(params['readOnly'] !== 'false');
          this.searchTerm = params['searchTerm'];
          this.userId = params['userId'];
          return this.getDemands();
        })
      )
      .subscribe((res: any) => {
        console.log(res);
        this.demands = res.results;
        this.demandCount = res.count;
      });
  }
}
