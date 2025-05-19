import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ShareModule } from '../../share.module';
import { serverUrl } from '../../../environments/environment';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseHttpService } from '../../services/http/base-http.service';
import { VideoService } from '../../services/video.service';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './video-card.component.html',
  styleUrl: './video-card.component.scss',
})
export class VideoCardComponent {
  serverUrl = serverUrl;
  router = inject(Router);
  @Input() video: any;
  @Input() readOnly: boolean = true;
  @Output() onDelete = new EventEmitter();
  @Output() onUpdate = new EventEmitter();
  http = inject(BaseHttpService);
  msg = inject(NzMessageService);
  videoService = inject(VideoService);
  tagColors = ['success', 'processing', 'error', 'warning'];
  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }
  sliceTitle(title: string) {
    return title.length > 15 ? `${title.slice(0, 15)}...` : title;
  }
  toDetail() {
    this.router.navigate(['home', 'video-detail', this.video.id]);
  }

  delete() {
    this.http.delete(`/video/${this.video.id}`).subscribe((res) => {
      this.msg.success('删除成功');
      location.reload();
      this.onDelete.emit({ video: this.video, res });
    });
  }

  update($event: Event) {
    $event.stopPropagation();
    const modal = this.videoService.showUpdateModal(this.video);
    modal.afterClose.subscribe((res) => {
      this.onUpdate.emit({ video: this.video, res });
    });
  }
}
