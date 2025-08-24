import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RecommendedProduct } from '../recommended-products/recommended-products.component';

@Component({
  selector: 'app-best-sellers-section',
  templateUrl: './best-sellers-section.component.html',
  styleUrls: ['./best-sellers-section.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule]
})
export class BestSellersComponent {
  @Input() title: string = 'Los más vendidos';
  @Input() products: RecommendedProduct[] = [];
  @Output() addProduct = new EventEmitter<RecommendedProduct>();

  addToCart(product: RecommendedProduct): void {
    this.addProduct.emit(product);
  }
}
