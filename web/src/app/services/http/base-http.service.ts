import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { serverUrl } from '../../../environments/environment';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as qs from 'qs';
import { EnvironmentService } from '../environment.service';

export interface HttpCustomConfig {
  needSuccessInfo?: boolean; // 是否需要"操作成功"提示
  showLoading?: boolean; // 是否需要loading
  otherUrl?: boolean; // 是否是第三方接口
}

export interface ActionResult<T> {
  code: number;
  msg: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class BaseHttpService {
  uri: string;
  public http = inject(HttpClient);
  message = inject(NzMessageService);
  config = inject(EnvironmentService);

  protected constructor() {
    this.uri = this.config.environment?.serverUrl || serverUrl;
  }

  get<T>(
    path: string,
    param?: NzSafeAny,
    config?: HttpCustomConfig
  ): Observable<T> {
    config = config || { needSuccessInfo: false };
    let reqPath = this.getUrl(path, config);
    const params = new HttpParams({ fromString: qs.stringify(param) });
    return this.http
      .get<ActionResult<T>>(reqPath, { params })
      .pipe(this.resultHandle<T>(config));
  }

  getDetail<T>(
    path: string,
    detail: string | number,
    param?: NzSafeAny,
    config?: HttpCustomConfig
  ): Observable<T> {
    config = config || { needSuccessInfo: false };
    let reqPath = this.getUrl(path, config);
    const params = new HttpParams({ fromString: qs.stringify(param) });
    return this.http
      .get<ActionResult<T>>(`${reqPath}${detail}/`, { params })
      .pipe(this.resultHandle<T>(config));
  }

  delete<T>(
    path: string,
    param?: NzSafeAny,
    config?: HttpCustomConfig
  ): Observable<T> {
    config = config || { needSuccessInfo: false };
    let reqPath = this.getUrl(path, config);
    const params = new HttpParams({ fromString: qs.stringify(param) });
    return this.http
      .delete<ActionResult<T>>(reqPath, { params })
      .pipe(this.resultHandle<T>(config));
  }

  post<T>(
    path: string,
    body?: NzSafeAny,
    config?: HttpCustomConfig
  ): Observable<T> {
    config = config || { needSuccessInfo: false };
    let reqPath = this.getUrl(path, config);
    return this.http
      .post<ActionResult<T>>(reqPath, body)
      .pipe(this.resultHandle<T>(config));
  }

  put<T>(
    path: string,
    body?: NzSafeAny,
    config?: HttpCustomConfig
  ): Observable<T> {
    config = config || { needSuccessInfo: false };
    let reqPath = this.getUrl(path, config);
    return this.http
      .put<ActionResult<T>>(reqPath, body)
      .pipe(this.resultHandle<T>(config));
  }
  patch<T>(
    path: string,
    id: string | number,
    body?: NzSafeAny,
    config?: HttpCustomConfig
  ): Observable<T> {
    config = config || { needSuccessInfo: false };
    let reqPath = this.getUrl(`/${path}/${id}/`, config);
    return this.http
      .patch<ActionResult<T>>(reqPath, body)
      .pipe(this.resultHandle<T>(config));
  }
  downLoadWithBlob(
    path: string,
    param?: NzSafeAny,
    config?: HttpCustomConfig
  ): Observable<NzSafeAny> {
    config = config || { needSuccessInfo: false };
    let reqPath = this.getUrl(path, config);
    return this.http.post(reqPath, param, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    });
  }

  getUrl(path: string, config: HttpCustomConfig): string {
    let reqPath = this.uri + path;
    if (config.otherUrl) {
      reqPath = path;
    }
    return reqPath;
  }

  resultHandle<T>(
    config: HttpCustomConfig
  ): (observable: Observable<ActionResult<T>>) => Observable<T> {
    return (observable: Observable<ActionResult<T>>) => {
      return observable.pipe(
        filter((item) => {
          return this.handleFilter(item, !!config.needSuccessInfo);
        }),
        map((item) => {
          return item.data;
        })
      );
    };
  }

  handleFilter<T>(item: ActionResult<T>, needSuccessInfo: boolean): boolean {
    if (item.code !== 0) {
      this.message.error(item.msg);
      return false;
    }
    if (needSuccessInfo) {
      this.message.success('操作成功');
    }
    return true;
  }
}
