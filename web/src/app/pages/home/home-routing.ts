import { Route } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { HomeComponent } from './home.component';
import { title } from '../../../environments/environment';

export default [
  {
    path: '',
    component: HomeComponent,
    title: `首页 - ${title}`, // angular14版本以上支持，修改浏览器title
    children: [
      { path: '', redirectTo: 'index', pathMatch: 'full' },
      {
        path: 'index',
        loadComponent: () =>
          import('./index/index.component').then((m) => m.IndexComponent),
      },
      {
        path: 'videos',
        loadComponent: () =>
          import('../video-list/video-list.component').then(
            (m) => m.VideoListComponent
          ),
      },
      {
        path: 'demands',
        loadComponent: () =>
          import('../demand-list/demand-list.component').then(
            (m) => m.DemandListComponent
          ),
      },
      {
        path: 'demand-detail/:id',
        loadComponent: () =>
          import('../demand-detail/demand-detail.component').then(
            (m) => m.DemandDetailComponent
          ),
      },
      {
        path: 'video-detail/:id',
        loadComponent: () =>
          import('../video-detail/video-detail.component').then(
            (m) => m.VideoDetailComponent
          ),
      },
      {
        path: 'user/:id',
        loadComponent: () =>
          import('../user-page/user-page.component').then(
            (m) => m.UserPageComponent
          ),
      },
      // {
      //   path: 'register-form',
      //   data: { key: 'register-form', shouldDetach: 'no' },
      //   loadComponent: () => import('./register-form/register-form.component').then(m => m.RegisterFormComponent)
      // }
    ],
  },
] as Route[];
