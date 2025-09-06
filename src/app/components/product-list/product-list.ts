import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule],
  templateUrl: './product-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProductService], // Add ProductService to providers
})
export class ProductListComponent implements OnInit {
  products = signal<any[]>([]);
  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(10);
  filterText = signal<string>('');
  searchText = signal<string>('');
  allProducts: any[] = []; // Store all products for local filtering/searching

  get tableProducts() {
    const data = this.products();
    if (data.length < this.itemsPerPage()) {
      return [...data, ...Array(this.itemsPerPage() - data.length).fill({})];
    }
    return data;
  }

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadAllProductsForFiltering();
  }

  loadAllProductsForFiltering(): void {
    // Load all products without pagination for local filtering and searching
    this.productService.getProducts(1000, 0).subscribe((data: any) => {
      this.allProducts = data;
      this.updateTable();
    });
  }

  updateTable(): void {
    let data = this.allProducts;
    if (this.filterText()) {
      data = data.filter((product) =>
        product.category?.name.toLowerCase().includes(this.filterText().toLowerCase())
      );
    }
    if (this.searchText()) {
      data = data.filter(
        (product) =>
          product.title.toLowerCase().includes(this.searchText().toLowerCase()) ||
          product.description.toLowerCase().includes(this.searchText().toLowerCase())
      );
    }
    const offset = (this.currentPage() - 1) * this.itemsPerPage();
    this.products.set(data.slice(offset, offset + this.itemsPerPage()));
  }

  nextPage(): void {
    this.currentPage.update((page) => page + 1);
    this.updateTable();
  }

  prevPage(): void {
    this.currentPage.update((page) => Math.max(1, page - 1)); // Ensure page doesn't go below 1
    this.updateTable();
  }

  applyFilters(): void {
    this.currentPage.set(1);
    this.updateTable();
  }

  onSearchChange(event: Event): void {
    this.searchText.set((event.target as HTMLInputElement).value);
    this.currentPage.set(1);
    this.updateTable();
  }
}

@NgModule({
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    // ...other providers...
  ],
})
export class AppModule {}
