import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface RecommendedProduct {
  id: string | number;
  name: string;
  imageUrl: string;
  originalPrice: string;
  salePrice: string;
  pointsPrice?: string;
  quantity: number;
  hasTag?: boolean;
  tagText?: string;
}

@Component({
  selector: 'app-recommended-products',
  templateUrl: './recommended-products.component.html',
  standalone: true,
  imports: [CommonModule, MatIconModule]
})
export class RecommendedProductsComponent {
  @Input() title: string = 'Productos recomendados';
  @Input() products: RecommendedProduct[] = [];
  @Output() addProduct = new EventEmitter<RecommendedProduct>();

  addToCart(product: RecommendedProduct): void {
    this.addProduct.emit(product);
  }
}
