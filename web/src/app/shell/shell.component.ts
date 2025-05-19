import { Component, inject } from "@angular/core";
import { Router, RouterModule, RouterOutlet } from "@angular/router";
import { UserService } from "../services/user.service";
import { WindowService } from "../services/window.service";
import { LoginService } from "../services/login.service";
import { CommonModule } from "@angular/common";
import { EnvironmentService } from "../services/environment.service";
import { NgZorroModule } from "../ng-zorro/ng-zorro.module";
import { title } from "../../environments/environment";
import { DemandService } from "../services/demand.service";
import { VideoService } from "../services/video.service";
@Component({
  selector: "app-shell",
  standalone: true,
  providers: [DemandService, VideoService],
  imports: [RouterOutlet, NgZorroModule, RouterModule, CommonModule],
  templateUrl: "./shell.component.html",
  styleUrl: "./shell.component.scss",
})
export class ShellComponent {
  constructor(
    private userService: UserService,
    private windowService: WindowService,
    private loginService: LoginService,
    public env: EnvironmentService
  ) {}
  router = inject(Router);
  demandService = inject(DemandService);
  videoService = inject(VideoService);
  name: string | null =
    this.windowService.getSessionStorage("name") ||
    this.windowService.getStorage("name");
  role: string | null =
    this.windowService.getSessionStorage("role") ||
    this.windowService.getStorage("role");
  userId =
    this.windowService.getStorage("user_id") ||
    this.windowService.getSessionStorage("user_id");
  title = title;
  menus: any = {
    User: [
      {
        name: "个人信息",
        url: "profile",
        icon: "user",
      },
      {
        name: "我的视频",
        url: ["videos"],
        queryParams: { readOnly: false, userId: this.userId },
        icon: "video-camera",
      },
      {
        name: "我的需求",
        url: "demands",
        queryParams: { readOnly: false, userId: this.userId },
        icon: "bulb",
      },
      {
        name: "我的收藏",
        url: "stars",
        icon: "star",
      },
      {
        name: "我的应标",
        url: "bids",
        icon: "audit",
      },
      {
        name: "回到首页",
        url: "/home",
        icon: "home",
      },
    ],
    Admin: [
      {
        name: "用户管理",
        url: "user-admin",
        icon: "user",
      },
    ],
  };
  toLogin() {
    this.router.navigateByUrl("/login");
  }
  ngOnInit() {}
  isCollapsed = false;
  publishDemand() {
    const modal = this.demandService.showNewDemandModal(this.userId);
  }
  uploadVideo() {
    return this.videoService.showNewModal(this.userId);
  }
  logOut() {
    this.loginService.logOut();
  }
}
