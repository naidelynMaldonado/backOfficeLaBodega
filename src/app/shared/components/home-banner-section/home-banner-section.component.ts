import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SectionOne {
  title: string;
  subTitle: string;
  boton: string;
  photo1: string;
  photo2: string;
  photo3: string;
}

interface ProductPhoto {
  title: string;
  subTitle: string;
  image: string;
  enlace: string;
}

interface ProductsSectionOne {
  title: string;
  photo1: ProductPhoto;
  photo2: ProductPhoto;
  photo3: ProductPhoto;
  photo4: ProductPhoto;
}

@Component({
  selector: 'app-home-banner-section',
  templateUrl: './home-banner-section.component.html',
  styleUrls: ['./home-banner-section.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeBannerSectionComponent {
  @Input() sectionOne: SectionOne = {
    title: '',
    subTitle: '',
    boton: '',
    photo1: '',
    photo2: '',
    photo3: ''
  };

  @Input() productsSectionOne: ProductsSectionOne = {
    title: '',
    photo1: { title: '', subTitle: '', image: '', enlace: '' },
    photo2: { title: '', subTitle: '', image: '', enlace: '' },
    photo3: { title: '', subTitle: '', image: '', enlace: '' },
    photo4: { title: '', subTitle: '', image: '', enlace: '' }
  };

  @Output() navigate = new EventEmitter<void>();
  @Output() navigatePromotion = new EventEmitter<string>();

  navigateToLink(): void {
    this.navigate.emit();
  }

  navigateToLinkPromociones(enlace: string): void {
    this.navigatePromotion.emit(enlace);
  }
}
