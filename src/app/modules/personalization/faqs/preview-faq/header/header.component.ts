import { Component } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  imports: [MatIconModule]
})
export class HeaderComponent {
  ICON_PRO=`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <rect width="20" height="20" fill="url(#pattern0_2817_2083)"/>
  <defs>
  <pattern id="pattern0_2817_2083" patternContentUnits="objectBoundingBox" width="1" height="1">
  <use xlink:href="#image0_2817_2083" transform="scale(0.015625)"/>
  </pattern>
  <image id="image0_2817_2083" width="64" height="64" xlink:href="data:image/png;base64,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"/>
  </defs>
  </svg>`;

  ROW_DOWN=`<svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M1.41421 0C0.523309 0 0.077142 1.07714 0.707107 1.70711L3.29289 4.29289C3.68342 4.68342 4.31658 4.68342 4.70711 4.29289L7.2929 1.70711C7.92286 1.07714 7.47669 0 6.58579 0H1.41421Z" fill="white"/>
  </svg>`;
  
  SEARCH=`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0_2817_2101)">
  <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="#002485"/>
  </g>
  <defs>
  <clipPath id="clip0_2817_2101">
  <rect width="24" height="24" fill="white"/>
  </clipPath>
  </defs>
  </svg>`;

  USER=`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0_2817_2111)">
  <path d="M12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM12 16C14.7 16 17.8 17.29 18 18H6C6.23 17.28 9.31 16 12 16ZM12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="white"/>
  </g>
  <defs>
  <clipPath id="clip0_2817_2111">
  <rect width="24" height="24" fill="white"/>
  </clipPath>
  </defs>
  </svg>`;

  CART=`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0_2817_2116)">
  <path d="M15.55 13C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C21.25 4.82 20.77 4 20.01 4H5.21L4.27 2H1V4H3L6.6 11.59L5.25 14.03C4.52 15.37 5.48 17 7 17H19V15H7L8.1 13H15.55ZM6.16 6H18.31L15.55 11H8.53L6.16 6ZM7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="#09367A"/>
  </g>
  <defs>
  <clipPath id="clip0_2817_2116">
  <rect width="24" height="24" fill="white"/>
  </clipPath>
  </defs>
  </svg>`;
  
  constructor(
    private iconRegistry: MatIconRegistry, 
    private sanitizer: DomSanitizer
  ){
    this.iconRegistry.addSvgIconLiteral('row-down', this.sanitizer.bypassSecurityTrustHtml(this.ROW_DOWN));
    this.iconRegistry.addSvgIconLiteral('promo', this.sanitizer.bypassSecurityTrustHtml(this.ICON_PRO));
    this.iconRegistry.addSvgIconLiteral('search', this.sanitizer.bypassSecurityTrustHtml(this.SEARCH));
    this.iconRegistry.addSvgIconLiteral('user', this.sanitizer.bypassSecurityTrustHtml(this.USER));
    this.iconRegistry.addSvgIconLiteral('car', this.sanitizer.bypassSecurityTrustHtml(this.CART));
  }
}
