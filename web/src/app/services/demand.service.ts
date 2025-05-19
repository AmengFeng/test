import { Injectable, inject } from '@angular/core';
import { BaseHttpService } from './http/base-http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NewDemandComponent } from '../components/new-demand/new-demand.component';
import { NewBidComponent } from '../components/new-bid/new-bid.component';

@Injectable({
  providedIn: 'root',
})
export class DemandService {
  url = '/demand/';
  modal = inject(NzModalService);
  msg = inject(NzMessageService);

  createDemand(data: any) {
    return this.http.post(this.url, data);
  }
  getDemands(userId?: string | number) {
    return this.http.get(this.url, { creator__id: userId });
  }
  deleteDemand(demandId: string | number) {
    return this.http.delete(`${this.url}/${demandId}/`);
  }
  updateDemand(demandId: string | number, value: any) {
    return this.http.patch('demand', demandId, value);
  }
  createBid(bid: any) {
    return this.http.post('/bid/', bid);
  }
  showNewDemandModal(userId?: string | number | null) {
    const modal = this.modal.create<NewDemandComponent, any>({
      nzTitle: '发布需求',
      nzContent: NewDemandComponent,
      nzMaskClosable: false,
      nzWidth: '1000px',
      nzOnOk: (instance) => {
        const form = instance.validateForm;
        return new Promise((resolve, reject) => {
          Object.values(form.controls).forEach((c) => {
            c.markAsDirty();
            c.updateValueAndValidity();
          });
          if (form.invalid) {
            return resolve(false);
          }
          const newDemand = { ...form.value, creator_id: userId };
          this.createDemand(newDemand).subscribe((res) => {
            this.msg.success('需求创建成功');
            location.reload();
            resolve(true);
          });
        });
      },
    });
    return modal;
  }
  showUpdateDemandModal(demand: any) {
    const modal = this.modal.create<NewDemandComponent, any>({
      nzTitle: '修改需求',
      nzContent: NewDemandComponent,
      nzMaskClosable: false,
      nzWidth: '1000px',
      nzOnOk: (instance) => {
        const form = instance.validateForm;
        return new Promise((resolve, reject) => {
          Object.values(form.controls).forEach((c) => {
            c.markAsDirty();
            c.updateValueAndValidity();
          });
          if (form.invalid) {
            return resolve(false);
          }
          this.updateDemand(demand.id, form.value).subscribe((res) => {
            this.msg.success('需求修改成功');
            location.reload();
            resolve(true);
          });
        });
      },
    });
    console.log(demand);

    modal.componentInstance?.validateForm.patchValue(demand);
    return modal;
  }

  showNewBidModal(demand_id: string | number, bidder_id: string | number) {
    const modal = this.modal.create<NewBidComponent, any>({
      nzTitle: '应标',
      nzContent: NewBidComponent,
      nzMaskClosable: false,
      nzWidth: '800px',
      nzOnOk: (instance) => {
        const form = instance.validateForm;
        return new Promise((resolve, reject) => {
          Object.values(form.controls).forEach((c) => {
            c.markAsDirty();
            c.updateValueAndValidity();
          });
          if (form.invalid) {
            return resolve(false);
          }
          const bid = { ...form.value, demand_id, bidder_id };
          console.log(bid);

          this.createBid(bid).subscribe((res) => {
            this.msg.success('应标成功');
            location.reload();
            resolve(true);
          });
        });
      },
    });
    return modal;
  }
  constructor(private http: BaseHttpService) {}
}
