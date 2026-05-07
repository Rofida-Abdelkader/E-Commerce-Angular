import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
})
export class StatCardComponent {
  @Input() icon = '📊';
  @Input() label = '';
  @Input() value: number | string = 0;
  @Input() color = '#6366F1';
  @Input() isCurrency = false;
  @Input() change?: number;

  get formatted(): string {
    if (typeof this.value === 'string') return this.value;
    if (this.isCurrency)
      return '$' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.value);
    return this.value.toLocaleString();
  }
}