import { Component, OnInit } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { FaqsService } from '../../faqs/faqs.service';
import { updateContent } from '../terms-and-conditions.types';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../previews-components/footer/footer.component';
import { HeaderComponent } from '../../previews-components/header/header.component';

@Component({
  selector: 'app-preview-terms-and-conditions',
  templateUrl: './preview-terms-and-conditions.component.html',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, RouterModule]
})
export class PreviewTermsAndConditionsComponent implements OnInit {
content = '';
    contentPreview: SafeHtml = '';

    constructor(
      private faqService: FaqsService,
      private sanitizer: DomSanitizer,
      // private alertService: AlertService,
    ) {
  
    }
  
    ngOnInit(): void {
        this.faqService.getContent().subscribe({
          next: (value) => {
            let rawHtml = value.contenido;
            this.content = value.contenido;

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
      
            this.contentPreview = this.sanitizeHTML(rawHtml);
            
          },
          error: () => {

          }
        })
    }
  
    sanitizeHTML(html: string): SafeHtml {
      return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    publish() {
      const formData: updateContent = {
        data: this.content,
        usuario: sessionStorage.getItem("usuario") || '',
      }
  
      this.faqService.publishContent(formData).subscribe({
        next: () => {
          // this.alertService.showSuccess("Contenido publicado con exito.")
        },
        error: () => {
          // this.alertService.showError("Error al publicar.")
        }
      })
    }
}
