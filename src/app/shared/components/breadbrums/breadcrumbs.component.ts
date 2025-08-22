import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  url?: string;   // Si no tiene url, se muestra como texto plano
}

@Component({
  selector: 'breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav aria-label="Breadcrumb">
      <ol class="bc-list">
        <li *ngFor="let crumb of items; let last = last" class="bc-item">
          <a *ngIf="!last && crumb.url" [routerLink]="crumb.url" class="bc-link">
            {{ crumb.label }}
          </a>
          <span *ngIf="last || !crumb.url" class="bc-current" [attr.aria-current]="last ? 'page' : null">
            {{ crumb.label }}
          </span>

          <!-- separador -->
          <span *ngIf="!last" class="bc-sep">&gt;</span>
        </li>
      </ol>
    </nav>
  `,
  styles: [`
    :host { display:block; }
    .bc-list { 
      list-style: none; 
      display: flex; 
      margin: 0; 
      padding: 0; 
      color: #6b7280; /* gris base */
    }
    .bc-item { display: flex; align-items: center; }
    .bc-link { 
      color: #6b7280; /* gris medio */
      text-decoration: none;  /* 👈 elimina la línea */
      transition: color 0.2s;
    }
    .bc-link:hover { 
      color: #374151; /* gris más oscuro */
    }
    .bc-current { 
      font-weight: 500; 
      color: #374151; /* gris oscuro */
    }
    .bc-sep { 
      margin: 0 8px; 
      color: #9ca3af; /* gris clarito para separador */
    }
  `]
})
export class BreadcrumbsComponent {
  @Input() items: BreadcrumbItem[] = [];
}
