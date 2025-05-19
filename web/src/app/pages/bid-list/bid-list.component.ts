import { Component, inject } from '@angular/core';
import { ShareModule } from '../../share.module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseHttpService } from '../../services/http/base-http.service';
import { WindowService } from '../../services/window.service';
import { serverUrl } from '../../../environments/environment';
import { NzImageService } from 'ng-zorro-antd/image';

@Component({
  selector: 'app-bid-list',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './bid-list.component.html',
  styleUrl: './bid-list.component.scss',
})
export class BidListComponent {
  modeIndex = 0;
  msg = inject(NzMessageService);
  http = inject(BaseHttpService);
  windowService = inject(WindowService);
  nzImageService = inject(NzImageService);
  serverUrl = serverUrl;
  userId =
    this.windowService.getStorage('user_id') ||
    this.windowService.getSessionStorage('user_id');
  received: any = [];
  sent: any = [];
  getReceived() {
    this.http
      .get('/bid/', {
        demand__creator__id: this.userId,
      })
      .subscribe((res) => {
        console.log(res);
        this.received = res;
      });
  }
  preview(cover_addrs: string[]) {
    console.log(cover_addrs);

    const images = cover_addrs.map((addr) => {
      return {
        src: `${serverUrl}${addr}`,
        alt: '视频截图',
      };
    });
    this.nzImageService.preview(images, {
      nzZoom: 1,
      nzRotate: 0,
      nzScaleStep: 0.5,
    });
  }
  getSent() {
    this.http
      .get('/bid/', {
        bidder: this.userId,
      })
      .subscribe((res) => {
        console.log(res);
        this.sent = res;
      });
  }
  confirmBid(bid: any) {
    this.http.post(`/bid/${bid.id}/confirm_bid/`).subscribe((res) => {
      console.log(res);
      this.msg.success('确认成功，可开始下载视频');
      this.getReceived();
      this.getSent();
    });
  }
  reject(bid: any) {
    this.http.patch('bid', bid.id, { status: '已废弃' }).subscribe((res) => {
      this.getSent();
      this.getReceived();

      this.msg.success('撤标成功');
    });
  }
  ngOnInit() {
    this.getReceived();
    this.getSent();
  }
}
