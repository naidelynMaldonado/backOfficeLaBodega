import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FaqsService } from './faqs.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from '../../../shared/components/iconSvg/iconSvg.component';
import { LoadingService } from '../../../core/services/loading.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule, SvgIconComponent], // Aquí puedes agregar los módulos necesarios si es un componente standalone
  templateUrl: './faqs.component.html',
})
export class FaqsComponent implements OnInit {

  content: SafeHtml = ''; // Cambia el tipo a SafeHtml

  constructor(
    private faqService: FaqsService,
    private sanitizer: DomSanitizer,
  private router: Router,
  private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
  this.loadingService.onLoading();
  this.faqService.getContent().pipe(finalize(() => this.loadingService.offLoading())).subscribe({
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
    this.router.navigate(['/main/faqs/edit']);
  }

  preview() {
    this.router.navigate(['/preview-faqs']);
  }
}
