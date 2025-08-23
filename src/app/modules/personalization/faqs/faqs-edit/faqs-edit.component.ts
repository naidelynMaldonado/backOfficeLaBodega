import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { FaqsService } from '../faqs.service';
import { Content, updateContent } from '../faqs.types';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SvgIconComponent } from '../../../../shared/components/iconSvg/iconSvg.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'; // ✅ default import
import { LoadingService } from '../../../../core/services/loading.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-faqs-edit',
  standalone: true,
  templateUrl: './faqs-edit.component.html',
  imports: [
    ReactiveFormsModule,
    MatMenuModule,
    FormsModule,
    CommonModule,
    SvgIconComponent,
    CKEditorModule
  ],
})
export class FaqsEditComponent implements OnInit {
  public Editor: any = ClassicEditor;              // ✅ usar `any` para evitar errores de tipado del compilador
  public editorContent: string = '';          // Contenido inicial

  /** Render sólo en navegador (SSR-safe) */
  get isBrowser() { return isPlatformBrowser(this.pid); }

  /** Defer del montaje para evitar peleas de hidratación */
  showEditor = false;

  constructor(
    private router: Router,
    private faqsService: FaqsService,
  private loadingService: LoadingService,
    @Inject(PLATFORM_ID) private pid: Object
  ) {}

  ngOnInit(): void {
    if (!this.isBrowser) return;

    // Monta el editor un microtask después (evita mismatch SSR/Hydration)
    queueMicrotask(() => { this.showEditor = true; });

    // Cargar contenido desde la API
    this.loadingService.onLoading();
    this.faqsService.getContent().pipe(finalize(() => this.loadingService.offLoading())).subscribe({
      next: (response: Content) => {
        this.editorContent = response?.contenido ?? '';
      },
      error: () => {
        // Manejo simple de error (opcional: mostrar toast)
        this.editorContent = '';
      }
    });
  }

  save(): void {
    const formData: updateContent = {
      data: this.editorContent,
      usuario: sessionStorage.getItem('usuario') || localStorage.getItem('usuario') || '',
    };

    this.loadingService.onLoading();
    this.faqsService.putContent(formData).pipe(finalize(() => this.loadingService.offLoading())).subscribe({
      next: () => {
        // opcional: feedback de éxito
      },
      error: () => {
        // opcional: feedback de error
      }
    });
  }

  back(): void {
  this.router.navigate(['/main/faqs']);
  }

  viewPreview(): void {
  this.router.navigate(['/preview-faqs']);
  }
}
