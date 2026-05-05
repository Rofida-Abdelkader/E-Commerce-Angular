import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-sidebar.html',
  styleUrl: './filter-sidebar.scss'
})
export class FilterSidebarComponent implements OnInit {

  categories: string[] = [];
  selectedCategory = '';

  @Output() categorySelected = new EventEmitter<string>();

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(res => {
      this.categories = [...new Set(res.map(p => p.category))];
    });
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
    this.categorySelected.emit(cat);
  }

  clear() {
    this.selectedCategory = '';
    this.categorySelected.emit('');
  }
}
