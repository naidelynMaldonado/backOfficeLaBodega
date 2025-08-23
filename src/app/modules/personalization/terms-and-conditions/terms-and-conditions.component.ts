import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SvgIconComponent } from '../../../shared/components/iconSvg/iconSvg.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TermsAndConditionsService } from './terms-and-conditions.service';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
})
export class TermsAndConditionsComponent implements OnInit {

  content: SafeHtml = '';

  constructor( 
      private termsandconditions: TermsAndConditionsService,
      private sanitizer: DomSanitizer,
      private router: Router
    ) { }
  
    ngOnInit(): void {
      this.termsandconditions.getContent().subscribe({
        next: (value) => {
          let rawHtml = value.contenido;
  
        // Agrega las clases de Tailwind CSS
        rawHtml = rawHtml
          .replace(/<h1>/g, '<h1 class="text-h1">')
          .replace(/<h2>/g, '<h2 class="text-h2">')
          .replace(/<h3>/g, '<h2 class="text-h2">')
          .replace(/<h4>/g, '<h2 class="text-h2">')
          .replace(/<h5>/g, '<h2 class="text-h2">')
          .replace(/<ol>/g, '<ol class="list-decimal pl-10">')
          .replace(/<ul>/g, '<ul class="list-disc pl-10">') 
          .replace(/<p><\/p>/g, '<br/>');
  
        this.content = this.sanitizeHTML(rawHtml);
        },
        error: () => {
        }
      });
    }
  
    sanitizeHTML(html: string): SafeHtml {
      return this.sanitizer.bypassSecurityTrustHtml(html);
    }
  
    edit() {
    this.router.navigate(['/main/terms-and-conditions/edit']);
    }
  
    preview() {
    this.router.navigate(['/preview-terms-and-conditions']);
    }

}
