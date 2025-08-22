import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgClass } from '@angular/common';

@Component({
  selector: 'iconSvg',
  imports: [NgClass],
  template: `
    <span [innerHTML]="svgContent"
          [ngClass]="customClass"
          class="inline-flex items-center justify-center">
    </span>
  `,
  styles: [
    `
      :host {
        display: inline-block;
        line-height: 0;
      }
      span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      svg {
        display: block;
        width: inherit;
        height: inherit;
      }
    `,
  ],
})
export class SvgIconComponent implements OnChanges {
  @Input() name!: string;
  @Input() customClass?: string | string[];
  svgContent!: SafeHtml;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['name'] && this.name) {
      this.loadSvg(this.name).subscribe((svgText) => {
        // Sanitizar el SVG antes de insertarlo en el DOM
        this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svgText);
      });
    }
  }

  private loadSvg(iconName: string): Observable<string> {
    const url = `assets/icons/${iconName}.svg`;
    return this.http.get(url, { responseType: 'text' });
  }
}
