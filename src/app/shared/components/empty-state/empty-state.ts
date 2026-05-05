import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyStateComponent {
  @Input() icon = '📭';
  @Input() title = 'No results found';
  @Input() description = 'Try adjusting your search or filters.';
}