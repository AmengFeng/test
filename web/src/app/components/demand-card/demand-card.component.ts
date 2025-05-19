import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ShareModule } from '../../share.module';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseHttpService } from '../../services/http/base-http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DemandService } from '../../services/demand.service';

@Component({
  selector: 'app-demand-card',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './demand-card.component.html',
  styleUrl: './demand-card.component.scss',
})
export class DemandCardComponent {
  @Input() demand: any;
  @Input() readOnly: boolean = true;
  @Output() onDelete = new EventEmitter();
  @Output() onUpdate = new EventEmitter();
  router = inject(Router);
  http = inject(BaseHttpService);
  msg = inject(NzMessageService);
  demandService = inject(DemandService);
  tagColors = ['success', 'processing', 'error', 'warning'];
  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  toDetail() {
    this.router.navigate(['home', 'demand-detail', this.demand.id]);
  }
  delete() {
    this.http.delete(`/demand/${this.demand.id}`).subscribe((res) => {
      this.msg.success('删除成功');
      location.reload();
      this.onDelete.emit({ demand: this.demand, res });
    });
  }

  update($event: Event) {
    $event.stopPropagation();
    const modal = this.demandService.showUpdateDemandModal(this.demand);
    modal.afterClose.subscribe((res) => {
      this.onUpdate.emit({ demand: this.demand, res });
    });
  }
}
