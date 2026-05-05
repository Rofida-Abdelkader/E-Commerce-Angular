import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() total = 0;
  @Input() pageSize = 10;
  @Output() pageChange = new EventEmitter<number>();

  get startItem(): number { return (this.currentPage - 1) * this.pageSize + 1; }
  get endItem(): number { return Math.min(this.currentPage * this.pageSize, this.total); }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const max = this.totalPages;
    const cur = this.currentPage;
    if (max <= 7) {
      for (let i = 1; i <= max; i++) pages.push(i);
    } else {
      pages.push(1);
      if (cur > 3) pages.push(-1);
      for (let i = Math.max(2, cur - 1); i <= Math.min(max - 1, cur + 1); i++) pages.push(i);
      if (cur < max - 2) pages.push(-1);
      pages.push(max);
    }
    return pages;
  }

  go(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage)
      this.pageChange.emit(page);
  }
}