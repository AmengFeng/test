import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { fnCheckForm } from '../../utils/tools';
import { LoginService } from '../../services/login.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgZorroModule } from '../../ng-zorro/ng-zorro.module';
import { isPasswordPass } from '../../utils/validate/validate';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, NgZorroModule],
})
export class LoginFormComponent implements OnInit {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  roles = ['User', 'Admin'];
  roleIndex = 0;
  isVisible = false;
  destroyRef = inject(DestroyRef);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private msg = inject(NzMessageService);
  private jwtService = new JwtHelperService();
  private fb = inject(FormBuilder);
  showModal() {
    this.isVisible = true;
  }
  cancelRegister() {
    this.registerForm.reset();
    this.isVisible = false;
  }
  register() {
    if (!this.registerForm.valid) {
      return;
    }
    console.log(this.registerForm.value);
    this.loginService.register(this.registerForm.value).subscribe((res) => {
      console.log(res);
      this.msg.success('注册成功');
      this.cancelRegister();
    });
  }
  login(): void {
    if (!fnCheckForm(this.loginForm)) {
      return;
    }

    const param = this.loginForm.getRawValue();
    const role = this.roles[this.roleIndex];
    const routeMap: any = { Admin: '/shell', User: '/home' };
    this.loginService
      .login({ ...param, role })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((userToken) => {
        try {
          let tokenInfo = this.jwtService.decodeToken(userToken.access);
          this.loginService.setToken(userToken);
          this.loginService.setTokenInfo(tokenInfo);
          this.router.navigateByUrl(routeMap[role]);
          this.msg.success('登录成功');
        } catch (err) {
          this.msg.error('Token 无效，请重新登录');
        }
      });
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
    this.registerForm = this.fb.group({
      name: [null, [Validators.required]],
      username: [null, [Validators.required]],
      password: [null, [this.passwordValidator]],
    });
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const valid = isPasswordPass(password);
    return valid ? null : { password: true, error: true };
  }
  autoTips = {
    default: {
      password: '密码需6~20位的数字和非数字组成',
      required: '此项是必填项',
    },
  };
}
