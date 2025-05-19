import { Component, ViewContainerRef, inject } from '@angular/core';
import { ShareModule } from '../../share.module';
import { title, description, footer } from '../../../environments/environment';
import { DemandCardComponent } from '../../components/demand-card/demand-card.component';
import { Router } from '@angular/router';
import { WindowService } from '../../services/window.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NewDemandComponent } from '../../components/new-demand/new-demand.component';
import { BaseHttpService } from '../../services/http/base-http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DemandService } from '../../services/demand.service';
import { VideoService } from '../../services/video.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ShareModule, DemandCardComponent],
  providers: [DemandService, VideoService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  router = inject(Router);
  windowService = inject(WindowService);
  modal = inject(NzModalService);
  http = inject(BaseHttpService);
  msg = inject(NzMessageService);
  demandService = inject(DemandService);
  videoService = inject(VideoService);
  title = title;
  description = description;
  footer = footer;
  userId =
    this.windowService.getStorage('user_id') ||
    this.windowService.getSessionStorage('user_id');
  name =
    this.windowService.getStorage('name') ||
    this.windowService.getSessionStorage('name') ||
    '未知用户';

  toLogin() {
    this.router.navigateByUrl('/login');
  }
  toShell() {
    this.router.navigateByUrl('/shell');
  }

  publishDemand() {
    const modal = this.demandService.showNewDemandModal(this.userId);
  }
  uploadVideo() {
    return this.videoService.showNewModal(this.userId);
  }
}
