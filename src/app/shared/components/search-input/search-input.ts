import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-input.html',
  styleUrl: './search-input.css',
})
export class SearchInputComponent implements OnDestroy {
  @Input() placeholder = 'Search...';
  @Output() searched = new EventEmitter<string>();

  value = '';
  private input$ = new Subject<string>();
  private sub = this.input$
    .pipe(debounceTime(350), distinctUntilChanged())
    .subscribe((v) => this.searched.emit(v));

  onInput(v: string): void { this.input$.next(v); }
  clear(): void { this.value = ''; this.input$.next(''); }
  ngOnDestroy(): void { this.sub.unsubscribe(); }
}