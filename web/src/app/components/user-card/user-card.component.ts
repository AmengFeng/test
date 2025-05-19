import { Component, Input } from '@angular/core';
import { ShareModule } from '../../share.module';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent {
  @Input() title: string = '';
  @Input() user: any;
}
