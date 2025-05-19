import { Component, inject } from '@angular/core';
import { ShareModule } from '../../share.module';
import { WindowService } from '../../services/window.service';
import { BaseHttpService } from '../../services/http/base-http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-user-admin',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './user-admin.component.html',
  styleUrl: './user-admin.component.scss',
})
export class UserAdminComponent {
  windowService = inject(WindowService);
  http = inject(BaseHttpService);
  msg = inject(NzMessageService);
  users: any = [];
  searchParams: any = {
    search: '',
    gender: '',
  };
  role =
    this.windowService.getSessionStorage('role') ||
    this.windowService.getStorage('role');
  getUser() {
    const _searchParams =
      this.role === 'Admin'
        ? this.searchParams
        : { ...this.searchParams, role: 'User' };
    this.http.get('/user/', _searchParams).subscribe((res: any) => {
      this.users = res;
      console.log(res);
    });
  }
  ngOnInit() {
    this.getUser();
  }
  delete(user: any) {
    this.http.delete('/user/' + user.id).subscribe((res) => {
      this.msg.success('删除成功');
      this.getUser();
    });
  }
  changeRole($event: string, user: any) {
    console.log($event);
    this.http.patch('user', user.id, { role: $event }).subscribe((res) => {
      console.log(res);
      this.msg.success('修改成功');
    });
  }
}
