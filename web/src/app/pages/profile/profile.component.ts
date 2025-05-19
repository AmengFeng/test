import { Component, inject } from '@angular/core';
import { ShareModule } from '../../share.module';
import { WindowService } from '../../services/window.service';
import { BaseHttpService } from '../../services/http/base-http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  windowService = inject(WindowService);
  http = inject(BaseHttpService);
  msg = inject(NzMessageService);
  isEditing = false;
  user_id =
    this.windowService.getSessionStorage('user_id') ||
    this.windowService.getStorage('user_id');
  user: any = {};
  getUser() {
    this.user_id &&
      this.http.getDetail('/user/', this.user_id).subscribe((res) => {
        this.user = res;
        console.log(res);
      });
  }
  ngOnInit() {
    this.getUser();
  }
  cancel() {
    this.isEditing = false;
    this.getUser();
  }

  save() {
    this.http.put(`/user/${this.user.id}/`, this.user).subscribe((res) => {
      this.cancel();
      this.msg.success('修改成功');
    });
  }
}
