import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Content, updateContent } from '../terms-and-conditions.types';
import { TermsAndConditionsService } from '../terms-and-conditions.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SvgIconComponent } from '../../../../shared/components/iconSvg/iconSvg.component';

@Component({
  selector: 'app-terms-and-conditions-edit',
  templateUrl: './terms-and-conditions-edit.component.html',
  standalone: true,
  imports: [
      ReactiveFormsModule,
      MatMenuModule,
      FormsModule,
      CommonModule,
      SvgIconComponent,
      CKEditorModule
    ],
})
export class TermsAndConditionsEditComponent implements OnInit {
public Editor: any = ClassicEditor;              // ✅ usar `any` para evitar errores de tipado del compilador
  public editorContent: string = '';          // Contenido inicial

  /** Render sólo en navegador (SSR-safe) */
  get isBrowser() { return isPlatformBrowser(this.pid); }

  /** Defer del montaje para evitar peleas de hidratación */
  showEditor = false;

  constructor(
    private router: Router,
    private termsandconditions: TermsAndConditionsService,
    @Inject(PLATFORM_ID) private pid: Object
  ) {}

  ngOnInit(): void {
    if (!this.isBrowser) return;

    // Monta el editor un microtask después (evita mismatch SSR/Hydration)
    queueMicrotask(() => { this.showEditor = true; });

    // Cargar contenido desde la API
    this.termsandconditions.getContent().subscribe({
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

    this.termsandconditions.putContent(formData).subscribe({
      next: () => {
        // opcional: feedback de éxito
      },
      error: () => {
        // opcional: feedback de error
      }
    });
  }

  back(): void {
  this.router.navigate(['/main/terms-and-conditions']);
  }

  viewPreview(): void {
  this.router.navigate(['/preview-terms-and-conditions']);
  }
}
