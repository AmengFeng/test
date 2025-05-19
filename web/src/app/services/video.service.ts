import { Injectable, inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NewDemandComponent } from '../components/new-demand/new-demand.component';
import { BaseHttpService } from './http/base-http.service';
import { NewVideoComponent } from '../components/new-video/new-video.component';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  url = '/video/';
  modal = inject(NzModalService);
  msg = inject(NzMessageService);

  create(data: any) {
    return this.http.post(this.url, data);
  }
  get(userId?: string | number) {
    return this.http.get(this.url, { creator__id: userId });
  }
  delete(id: string | number) {
    return this.http.delete(`${this.url}/${id}/`);
  }
  update(id: string | number, value: any) {
    return this.http.patch('video', id, value);
  }
  showNewModal(userId?: string | number | null) {
    const modal = this.modal.create<NewVideoComponent, any>({
      nzTitle: '上传视频',
      nzContent: NewVideoComponent,
      nzMaskClosable: false,
      nzWidth: '800px',
      nzOnOk: (instance) => {
        const form = instance.validateForm;
        return new Promise((resolve, reject) => {
          Object.values(form.controls).forEach((c) => {
            c.markAsDirty();
            c.updateValueAndValidity();
          });
          if (form.invalid) {
            return resolve(false);
          }
          const newData = { ...form.value, creator_id: userId };
          this.create(newData).subscribe((res) => {
            console.log(res);
            this.msg.success('视频上传成功');
            location.reload();
            resolve(true);
          });
        });
      },
    });
    return modal;
  }

  showUpdateModal(video: any) {
    const modal = this.modal.create<NewVideoComponent, any>({
      nzTitle: '修改视频',
      nzContent: NewVideoComponent,
      nzMaskClosable: false,
      nzWidth: '800px',
      nzOnOk: (instance) => {
        const form = instance.validateForm;
        return new Promise((resolve, reject) => {
          Object.values(form.controls).forEach((c) => {
            c.markAsDirty();
            c.updateValueAndValidity();
          });
          if (form.invalid) {
            return resolve(false);
          }
          this.update(video.id, form.value).subscribe((res) => {
            this.msg.success('视频修改成功');
            location.reload();
            resolve(true);
          });
        });
      },
    });
    modal.componentInstance?.validateForm.patchValue(video);
    return modal;
  }
  constructor(private http: BaseHttpService) {}
}
