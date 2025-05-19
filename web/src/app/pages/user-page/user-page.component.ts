import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { switchMap } from 'rxjs';
import { BaseHttpService } from '../../services/http/base-http.service';
import { WindowService } from '../../services/window.service';
import { ShareModule } from '../../share.module';
import { DemandCardComponent } from '../../components/demand-card/demand-card.component';
import { VideoCardComponent } from '../../components/video-card/video-card.component';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [ShareModule, DemandCardComponent, VideoCardComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss',
})
export class UserPageComponent {
  route = inject(ActivatedRoute);
  http = inject(BaseHttpService);
  msg = inject(NzMessageService);
  windowService = inject(WindowService);
  user: any;
  modeIndex = 0;
  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          return this.http.getDetail('/user/', params['id']);
        })
      )
      .subscribe((res) => {
        console.log(res);
        this.user = res;
      });
  }
}
