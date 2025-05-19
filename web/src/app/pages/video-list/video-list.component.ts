import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { switchMap } from 'rxjs';
import { VideoService } from '../../services/video.service';
import { ShareModule } from '../../share.module';
import { VideoCardComponent } from '../../components/video-card/video-card.component';
import { BaseHttpService } from '../../services/http/base-http.service';

@Component({
  selector: 'app-video-list',
  standalone: true,
  providers: [VideoService],

  imports: [ShareModule, VideoCardComponent],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss',
})
export class VideoListComponent {
  msg = inject(NzMessageService);
  videoService = inject(VideoService);
  http = inject(BaseHttpService);
  route = inject(ActivatedRoute);
  videoCount = 0;
  searchTerm?: string;
  readOnly = true;
  pageIndex = 1;
  videos: any = [];
  getVideos() {
    this.route.queryParams
      .pipe(
        switchMap((params) => {
          this.readOnly = params['readOnly'] !== 'false';
          return this.http.get('/video/', {
            page: this.pageIndex,
            search: this.searchTerm || params['searchTerm'],
            creator__id: params['userId'],
          });
        })
      )
      .subscribe((res: any) => {
        console.log(res);
        this.videos = res.results;
        this.videoCount = res.count;
      });
    // this.demandService.getDemands()
  }
  search() {
    this.pageIndex = 1;
    this.getVideos();
  }
  ngOnInit() {
    this.getVideos();
  }
}
