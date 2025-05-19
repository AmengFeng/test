import { Component, inject } from '@angular/core';
import { ShareModule } from '../../share.module';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { BaseHttpService } from '../../services/http/base-http.service';
import { VideoCardComponent } from '../../components/video-card/video-card.component';
import { UserCardComponent } from '../../components/user-card/user-card.component';
import { serverUrl } from '../../../environments/environment';
import { WindowService } from '../../services/window.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-video-detail',
  standalone: true,
  imports: [ShareModule, UserCardComponent, VideoCardComponent],
  templateUrl: './video-detail.component.html',
  styleUrl: './video-detail.component.scss',
})
export class VideoDetailComponent {
  route = inject(ActivatedRoute);
  http = inject(BaseHttpService);
  msg = inject(NzMessageService);
  windowService = inject(WindowService);
  fb = inject(FormBuilder);
  serverUrl = serverUrl;
  video: any;
  recommands: any = [];
  commentForm = this.fb.group({
    content: ['', [Validators.required, Validators.maxLength(50)]],
  });

  tagColors = ['success', 'processing', 'error', 'warning'];
  userId = Number(
    this.windowService.getStorage('user_id') ||
      this.windowService.getSessionStorage('user_id')
  );
  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }
  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          return this.getVideo(params['id']);
        })
      )
      .subscribe((res) => {
        this.video = res;
      });
    this.http.get('/video/', { page: 1 }).subscribe((res: any) => {
      this.recommands = res.results;
    });
  }

  getVideo(id: any) {
    return this.http.getDetail('/video/', id);
  }
  star() {
    this.http
      .patch('video', this.video.id, {
        stared_user_ids: [...this.video.stared_user_ids, this.userId],
      })
      .subscribe((res) => {
        this.video = res;
        this.msg.success('收藏成功');
      });
  }
  unstar() {
    this.http
      .patch('video', this.video.id, {
        stared_user_ids: this.video.stared_user_ids.filter(
          (uId: any) => uId != this.userId
        ),
      })
      .subscribe((res) => {
        this.video = res;
        this.msg.success('取消收藏成功');
      });
  }
  comment() {
    if (this.commentForm.valid) {
      this.http
        .post('/comment/', {
          ...this.commentForm.value,
          user: this.userId,
          video: this.video.id,
        })
        .subscribe((res) => {
          location.reload();
          this.commentForm.reset();
          this.msg.success('评论成功');
        });
    } else {
      this.commentForm.markAsDirty();
    }
  }
}
