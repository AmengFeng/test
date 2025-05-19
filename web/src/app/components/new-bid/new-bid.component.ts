import { Component, inject } from '@angular/core';
import { ShareModule } from '../../share.module';
import { Validators, NonNullableFormBuilder } from '@angular/forms';
import { WindowService } from '../../services/window.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseHttpService } from '../../services/http/base-http.service';
import { serverUrl } from '../../../environments/environment';

@Component({
  selector: 'app-new-bid',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './new-bid.component.html',
  styleUrl: './new-bid.component.scss',
})
export class NewBidComponent {
  windowService = inject(WindowService);
  validateForm = this.fb.group({
    video_addr: ['', [Validators.required]],
    cover_addrs: [[], [Validators.required]],
    description: ['', [Validators.required]],
    price: ['', [Validators.required]],
  });
  videoFileList: any = [];
  coverFileList: any = [];
  serverUrl = serverUrl;
  http = inject(BaseHttpService);
  msg = inject(NzMessageService);
  userId = Number(
    this.windowService.getStorage('user_id') ||
      this.windowService.getSessionStorage('user_id')
  );

  onChange({ file }: any, field: string): void {
    if (file.status === 'done') {
      this.msg.success('上传成功');
      this.validateForm.patchValue({ [field]: file.response.data });
    } else if (file.status === 'removed') {
      this.validateForm.patchValue({ [field]: undefined });
    }
  }
  onCoverChange({ file, fileList }: any): void {
    if (file.status === 'done') {
      this.msg.success('上传成功');
      const cover_addrs = fileList.map((f: any) => f.response.data);
      console.log(cover_addrs);
      this.validateForm.patchValue({ cover_addrs });
    } else if (file.status === 'removed') {
      const cover_addrs = fileList.map((f: any) => f.response.data);
      console.log(cover_addrs);
      this.validateForm.patchValue({ cover_addrs });
    }
  }
  ngOnInit() {}
  autoTips: Record<string, Record<string, string>> = {
    'zh-cn': {
      required: '必填项',
    },
    en: {
      required: 'Input is required',
    },
    default: {
      email: '邮箱格式不正确/The input is not valid email',
    },
  };
  constructor(private fb: NonNullableFormBuilder) {}
}
