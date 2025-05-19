import { Component, inject } from "@angular/core";
import { ShareModule } from "../../share.module";
import {
  FormsModule,
  NonNullableFormBuilder,
  Validators,
} from "@angular/forms";
import { EnvironmentService } from "../../services/environment.service";
import { serverUrl } from "../../../environments/environment";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzUploadFile } from "ng-zorro-antd/upload";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, finalize, map, switchMap } from "rxjs/operators";
import { throwError } from "rxjs";

@Component({
  selector: "app-new-video",
  standalone: true,
  imports: [ShareModule],
  templateUrl: "./new-video.component.html",
  styleUrl: "./new-video.component.scss",
})
export class NewVideoComponent {
  msg = inject(NzMessageService);
  http = inject(HttpClient);
  serverUrl = serverUrl;
  videoFileList: any = [];
  coverFileLIst: any = [];
  videoFile?: File;
  generateDescLoading = false;
  headers = {
    Authorization: "Bearer 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",
  };
  getVideo = (file: any, fileList: NzUploadFile[]) => {
    console.log(file);
    this.videoFile = file;
    return true;
  };

  onChange({ file }: any, field: string): void {
    if (file.status === "done") {
      this.videoFile = file.originFileObj;
      this.msg.success("上传成功");
      this.validateForm.patchValue({ [field]: file.response.data });
    } else if (file.status === "removed") {
      this.videoFile = undefined;
      this.validateForm.patchValue({ [field]: undefined });
    }
  }

  validateForm = this.fb.group({
    title: ["", [Validators.required]],
    description: ["", []],
    brief: ["", [Validators.required]],
    tags: [[], []],
    video_addr: [undefined, [Validators.required]],
    cover_addr: [undefined, [Validators.required]],
  });
  presetTags = [
    { value: "美食", label: "美食" },
    { value: "运动", label: "运动" },
    { value: "科技", label: "科技" },
    { value: "生活", label: "生活" },
    { value: "美妆", label: "美妆" },
  ];
  autoTips: Record<string, Record<string, string>> = {
    "zh-cn": {
      required: "必填项",
    },
    en: {
      required: "Input is required",
    },
    default: {
      email: "邮箱格式不正确/The input is not valid email",
    },
  };
  constructor(private fb: NonNullableFormBuilder) {}
}
