import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  constructor(private http: HttpClient) {}
  public environment!: any;
  setEnvironment() {
    return () =>
      new Promise<void>((resolve, reject) => {
        this.http.get('assets/config.json').subscribe((res) => {
          this.environment = res;
          resolve();
        });
      });
  }
}
