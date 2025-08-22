import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { FaqsService } from "../faqs.service";
import { updateContent } from "../faqs.types";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { SvgIconComponent } from "../../../../shared/components/iconSvg/iconSvg.component";
// import { AlertService } from "../../../shared/service/alert";

@Component({
    selector: 'app-preview-faq',
    templateUrl: './preview-faq.component.html',
    standalone: true,
    imports: [FooterComponent, HeaderComponent, SvgIconComponent]
  })
  export class PreviewFaqComponent implements OnInit {
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