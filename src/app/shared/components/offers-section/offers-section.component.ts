import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Offer {
  name: string;
  originalPrice: string;
  discountedPrice: string;
  discountText: string;
  image: string;
  backgroundColor: string;
  bottomBackgroundColor: string;
}

@Component({
  selector: 'app-offers-section',
  templateUrl: './offers-section.component.html',
  styleUrls: ['./offers-section.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class OffersSectionComponent {
  @Input() title: string = 'Tenemos ofertas para ti';
  @Input() offers: Offer[] = [
    {
      name: 'Vitamina D3 Now',
      originalPrice: 'L 135.00',
      discountedPrice: 'L 95.00',
      discountText: '50% DCTO',
      image: './assets/images/promo3.png',
      backgroundColor: '#FFC0A0',
      bottomBackgroundColor: '#FBE4DA'
    },
    {
      name: 'Collagen C Shot',
      originalPrice: 'L 135.00',
      discountedPrice: 'L 95.00',
      discountText: '50% DCTO',
      image: './assets/images/promo1.png',
      backgroundColor: '#EFF2FF',
      bottomBackgroundColor: '#D7DFFF'
    },
    {
      name: 'Sambucus',
      originalPrice: 'L 135.00',
      discountedPrice: 'L 95.00',
      discountText: '50% DCTO',
      image: './assets/images/promo2.png',
      backgroundColor: '#FFFBE4',
      bottomBackgroundColor: '#F8EDB4'
    },
    {
      name: 'Omega 369',
      originalPrice: 'L 135.00',
      discountedPrice: 'L 95.00',
      discountText: '50% DCTO',
      image: './assets/images/promo1.png',
      backgroundColor: '#FFFBE4',
      bottomBackgroundColor: '#F8EDB4'
    }
  ];
}
