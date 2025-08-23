import { Component, OnInit } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { ReturnPoliciesService } from './return-policies.service';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from '../../../shared/components/iconSvg/iconSvg.component';

@Component({
  selector: 'app-return-policies',
  templateUrl: './return-policies.component.html',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
})
export class ReturnPoliciesComponent implements OnInit {
content: SafeHtml = '';

  constructor(
    private returnService: ReturnPoliciesService,
    private sanitizer: DomSanitizer,
  ) {

  }

  ngOnInit(): void {
      this.returnService.getContent().subscribe({
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
      })
  }

  sanitizeHTML(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  edit() {
    location.href = '/office/return-policies/edit';
  }
  preview(){
    location.href = '/preview-return';
  }
}
