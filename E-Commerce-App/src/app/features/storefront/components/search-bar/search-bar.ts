import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss'
})
export class SearchBarComponent {

  @Output() searchChanged = new EventEmitter<string>();

  onInput(event: any) {
    this.searchChanged.emit(event.target.value);
  }
}