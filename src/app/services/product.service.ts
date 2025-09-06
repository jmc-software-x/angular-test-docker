import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: {
    id: number;
    name: string;
    image: string;
  };
  images: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl;
  private allProducts: Product[] = [];

  constructor(private http: HttpClient) { }

  getProducts(limit?: number, offset?: number): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
}