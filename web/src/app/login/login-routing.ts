import { Route } from '@angular/router';

import { LoginComponent } from './login.component';
import { title } from '../../environments/environment';

export default [
  {
    path: '',
    component: LoginComponent,
    title: `登录 - ${title}`, // angular14版本以上支持，修改浏览器title
    data: { key: 'login', shouldDetach: 'no' },
    children: [
      { path: '', redirectTo: '/login/login-form', pathMatch: 'full' },
      {
        path: 'login-form',
        data: { preload: true, key: 'login-form', shouldDetach: 'no' },
        loadComponent: () =>
          import('./login-form/login-form.component').then(
            (m) => m.LoginFormComponent
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
