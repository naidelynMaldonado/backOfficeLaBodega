import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ReturnPoliciesService } from '../return-policies.service';
import { Content, updateContent } from '../return-policies.types';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SvgIconComponent } from '../../../../shared/components/iconSvg/iconSvg.component';

@Component({
  selector: 'app-return-policies-edit',
  templateUrl: './return-policies-edit.component.html',
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
export class ReturnPoliciesEditComponent implements OnInit {
public Editor: any = ClassicEditor;              // ✅ usar `any` para evitar errores de tipado del compilador
  public editorContent: string = '';          // Contenido inicial

  /** Render sólo en navegador (SSR-safe) */
  get isBrowser() { return isPlatformBrowser(this.pid); }

  /** Defer del montaje para evitar peleas de hidratación */
  showEditor = false;

  constructor(
    private router: Router,
    private returnService: ReturnPoliciesService,
    @Inject(PLATFORM_ID) private pid: Object
  ) {}

  ngOnInit(): void {
    if (!this.isBrowser) return;

    // Monta el editor un microtask después (evita mismatch SSR/Hydration)
    queueMicrotask(() => { this.showEditor = true; });

    // Cargar contenido desde la API
    this.returnService.getContent().subscribe({
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

    this.returnService.putContent(formData).subscribe({
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
