import { Component, inject } from '@angular/core';
import { ShareModule } from '../../../share.module';
import {
  title,
  description,
  footer,
} from '../../../../environments/environment';
import { DemandCardComponent } from '../../../components/demand-card/demand-card.component';
import { Router, RouterOutlet } from '@angular/router';
import { VideoCardComponent } from '../../../components/video-card/video-card.component';
import { DemandService } from '../../../services/demand.service';
import { VideoService } from '../../../services/video.service';
@Component({
  selector: 'app-index',
  standalone: true,
  imports: [ShareModule, DemandCardComponent, VideoCardComponent, RouterOutlet],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})
export class IndexComponent {
  array = [1, 2, 3, 4];
  searchMode: 'videos' | 'demands' = 'videos';
  searchTerm = '';
  demands: any = [];
  videos: any = [];
  demandService = inject(DemandService);
  videoService = inject(VideoService);
  router = inject(Router);
  getDemands() {
    return this.demandService.getDemands().subscribe((res: any) => {
      console.log(res);
      this.demands = res.results;
    });
  }
  getVideos() {
    return this.videoService.get().subscribe((res: any) => {
      console.log(res);
      this.videos = res.results;
    });
  }
  ngOnInit() {
    this.getDemands();
    this.getVideos();
  }
  search() {
    this.router.navigate(['home', this.searchMode], {
      queryParams: { searchTerm: this.searchTerm },
    });
  }
}
