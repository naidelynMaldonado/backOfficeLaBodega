import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class IconsService {
  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {}

  registerIcons() {
    // placeholder: register app icons here if needed
    // Example: this.iconRegistry.addSvgIconLiteral('example', this.sanitizer.bypassSecurityTrustHtml('<svg>...</svg>'));
  }
}
