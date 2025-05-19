import { Component, inject } from '@angular/core';
import { ShareModule } from '../../share.module';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { BaseHttpService } from '../../services/http/base-http.service';
import { UserCardComponent } from '../../components/user-card/user-card.component';
import { DemandCardComponent } from '../../components/demand-card/demand-card.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { WindowService } from '../../services/window.service';
import { DemandService } from '../../services/demand.service';

@Component({
  selector: 'app-demand-detail',
  standalone: true,
  imports: [ShareModule, UserCardComponent, DemandCardComponent],
  templateUrl: './demand-detail.component.html',
  styleUrl: './demand-detail.component.scss',
})
export class DemandDetailComponent {
  route = inject(ActivatedRoute);
  http = inject(BaseHttpService);
  msg = inject(NzMessageService);
  windowService = inject(WindowService);
  demandService = inject(DemandService);
  demand: any;
  recommands: any = [];
  userId = Number(
    this.windowService.getStorage('user_id') ||
      this.windowService.getSessionStorage('user_id')
  );
  tagColors = ['success', 'processing', 'error', 'warning'];
  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }
  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          return this.http.getDetail('/demand/', params['id']);
        })
      )
      .subscribe((res) => {
        this.demand = res;
        // 现在你也可以在你的组件中使用 this.itemId 了
      });
    this.http.get('/demand/', { page: 1 }).subscribe((res: any) => {
      this.recommands = res.results;
    });
  }
  star() {
    this.http
      .patch('demand', this.demand.id, {
        stared_user_ids: [...this.demand.stared_user_ids, this.userId],
      })
      .subscribe((res) => {
        this.demand = res;
        this.msg.success('收藏成功');
      });
  }
  unstar() {
    this.http
      .patch('demand', this.demand.id, {
        stared_user_ids: this.demand.stared_user_ids.filter(
          (uId: any) => uId != this.userId
        ),
      })
      .subscribe((res) => {
        this.demand = res;
        this.msg.success('取消收藏成功');
      });
  }
  bid() {
    this.demandService.showNewBidModal(this.demand.id, this.userId);
  }
}
