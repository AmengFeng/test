import { Component, inject } from '@angular/core';
import { ShareModule } from '../../share.module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseHttpService } from '../../services/http/base-http.service';
import { WindowService } from '../../services/window.service';
import { DemandCardComponent } from '../../components/demand-card/demand-card.component';
import { VideoCardComponent } from '../../components/video-card/video-card.component';

@Component({
  selector: 'app-star-list',
  standalone: true,
  imports: [ShareModule, DemandCardComponent, VideoCardComponent],
  templateUrl: './star-list.component.html',
  styleUrl: './star-list.component.scss',
})
export class StarListComponent {
  msg = inject(NzMessageService);
  http = inject(BaseHttpService);
  windowService = inject(WindowService);
  modeIndex = 0;
  videos = [];
  demands = [];
  userId =
    this.windowService.getStorage('user_id') ||
    this.windowService.getSessionStorage('user_id');
  getUser() {
    this.http.get(`/user/${this.userId}`).subscribe((res: any) => {
      this.videos = res.stared_videos;
      this.demands = res.stared_demands;
    });
  }
  ngOnInit() {
    this.getUser();
  }
}
