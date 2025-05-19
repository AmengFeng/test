import { Injectable } from '@angular/core';
import { BaseHttpService } from './http/base-http.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(public http: BaseHttpService) {}
  getUser(userId: string) {
    return this.http.get<{ name: string; code: string }>(`/user/${userId}`);
  }
}
