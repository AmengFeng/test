import { Route } from '@angular/router';
import { ShellComponent } from './shell.component';
import { loginGuard } from '../services/guards/login.guard';
import { title } from '../../environments/environment';
import { shellRedirectGuard } from '../services/guards/shell-redirect.guard';

export default [
  {
    path: '',
    component: ShellComponent,
    title: `首页 - ${title}`, // angular14版本以上支持，修改浏览器title
    canActivate: [shellRedirectGuard],
    children: [
      {
        path: 'log',
        loadComponent: () =>
          import('../pages/log/log.component').then((m) => m.LogComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../pages/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: 'videos',
        loadComponent: () =>
          import('../pages/video-list/video-list.component').then(
            (m) => m.VideoListComponent
          ),
      },
      {
        path: 'demands',
        loadComponent: () =>
          import('../pages/demand-list/demand-list.component').then(
            (m) => m.DemandListComponent
          ),
      },
      {
        path: 'bids',
        loadComponent: () =>
          import('../pages/bid-list/bid-list.component').then(
            (m) => m.BidListComponent
          ),
      },
      {
        path: 'stars',
        loadComponent: () =>
          import('../pages/star-list/star-list.component').then(
            (m) => m.StarListComponent
          ),
      },
      {
        path: 'user-admin',
        loadComponent: () =>
          import('../pages/user-admin/user-admin.component').then(
            (m) => m.UserAdminComponent
          ),
      },
    ],
  },
] as Route[];
