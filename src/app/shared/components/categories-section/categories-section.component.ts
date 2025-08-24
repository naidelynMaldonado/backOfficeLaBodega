import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface Category {
  id: string | number;
  name: string;
  imageUrl: string;
  backgroundColor: string;
  url?: string;
}

@Component({
  selector: 'app-categories-section',
  templateUrl: './categories-section.component.html',
  styleUrls: ['./categories-section.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CategoriesSectionComponent {
  @Input() title: string = 'Nuestras categorías';
  @Input() buttonText: string = 'Comprar ahora';
  @Input() categories: Category[] = [];
  @Output() buttonClick = new EventEmitter<void>();

  onButtonClick(): void {
    this.buttonClick.emit();
  }
}
