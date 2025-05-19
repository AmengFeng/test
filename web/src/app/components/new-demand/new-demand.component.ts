import { Component, inject } from "@angular/core";
import { ShareModule } from "../../share.module";
import { NonNullableFormBuilder, Validators } from "@angular/forms";
import { IDomEditor, createEditor, createToolbar } from "@wangeditor/editor";
import debounce from "lodash/debounce";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { HttpClient } from "@angular/common/http";
import { finalize } from "rxjs";
import { NzMessageService } from "ng-zorro-antd/message";
import { serverUrl } from "../../../environments/environment";
@Component({
  selector: "app-new-demand",
  standalone: true,
  imports: [ShareModule],
  templateUrl: "./new-demand.component.html",
  styleUrl: "./new-demand.component.scss",
})
export class NewDemandComponent {
  msg = inject(NzMessageService);
  http = inject(HttpClient);
  serverUrl = serverUrl;
  validateForm = this.fb.group({
    title: ["", [Validators.required]],
    description: ["", [Validators.required]],
    brief: ["", [Validators.required]],
    tags: [[], []],
    price: ["", [Validators.required]],
  });
  editor!: IDomEditor;
  url = "https://api.openai.com/v1/chat/completions";
  headers = {
    Authorization: "Bearer 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",
  };
  presetTags = [
    { value: "美食", label: "美食" },
    { value: "运动", label: "运动" },
    { value: "科技", label: "科技" },
    { value: "生活", label: "生活" },
    { value: "美妆", label: "美妆" },
  ];
  presetPrices = [
    { value: "0~500￥", label: "0~500￥" },
    { value: "501~1000￥", label: "501~1000￥" },
    { value: "1001~2000￥", label: "1001~2000￥" },
    { value: "2001~4000￥", label: "2001~4000￥" },
    { value: "4000￥以上", label: "4000￥以上" },
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
  generateDescLoading = false;

  async generateDesc() {
    const brief = this.validateForm.value.brief;
    if (!(brief && brief.length > 10)) {
      this.msg.error("请输入需求简介（大于10个字）");
      return;
    }
    this.generateDescLoading = true;
    this.http
      .post(this.serverUrl + "/gpt/", { content: brief })
      .pipe(finalize(() => (this.generateDescLoading = false)))
      .subscribe((res: any) => {
        console.log(res.data);
        this.editor.setHtml(res.data);
        this.validateForm.patchValue({ description: res.data });
      });
  }
  ngAfterViewInit() {
    this.editor = createEditor({
      selector: "#editor-text-area",
      config: {
        placeholder: "请输入需求描述",
        onChange: debounce((editor) => {
          this.validateForm.patchValue({ description: editor.getHtml() });
        }, 500),
      },
    });
    const toolbar = createToolbar({
      editor: this.editor,
      selector: "#editor-toolbar",
      config: {
        excludeKeys: ["group-image", "fullScreen"],
      },
    });
  }
  constructor(private fb: NonNullableFormBuilder) {}
}
