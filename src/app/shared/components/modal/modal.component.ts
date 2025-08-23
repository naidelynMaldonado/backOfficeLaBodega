import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

/**
 * Angular standalone modal component (single file)
 * - Accesible (role="dialog", aria-modal, focus trap, ESC to close)
 * - Cierra al hacer click en el backdrop (configurable)
 * - Soporta two-way binding con [(open)]
 * - Proyección de contenido <ng-content> y slot de footer con [modal-footer]
 *
 * Uso:
 * <button (click)="isOpen = true">Abrir</button>
 * <app-modal [(open)]="isOpen" title="Título del modal">
 *   <p>Contenido ✨</p>
 *   <div modal-footer>
 *     <button type="button" (click)="isOpen = false">Cerrar</button>
 *     <button type="button">Guardar</button>
 *   </div>
 * </app-modal>
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Backdrop -->
    <div class="backdrop" *ngIf="open" (click)="backdropClick()" aria-hidden="true"></div>

    <!-- Dialog -->
    <div *ngIf="open" class="dialog" role="dialog" [attr.aria-modal]="true"
         [attr.aria-labelledby]="title ? titleId : null" [attr.aria-describedby]="descriptionId"
         (keydown)="onKeydown($event)" #dialogEl>

      <div class="panel" #panel>
        <header class="header">
          <h2 class="title" [id]="titleId">{{ title }}</h2>
          <button type="button" class="close" (click)="close()" aria-label="Cerrar">×</button>
        </header>

        <section class="body" [id]="descriptionId">
          <ng-content></ng-content>
        </section>

        <footer class="footer">
          <ng-content select="[modal-footer]"></ng-content>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    :host { --modal-bg: #fff; --modal-radius: 16px; --shadow: 0 24px 60px rgba(0,0,0,.18); }
    .backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.5); backdrop-filter: blur(1px); z-index: 999; }
    .dialog { position: fixed; inset: 0; display: grid; place-items: center; padding: 1rem; z-index: 1000; }
    .panel { width: min(640px, 92vw); max-height: 85vh; overflow: auto; background: var(--modal-bg); border-radius: var(--modal-radius); box-shadow: var(--shadow); }
    .header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid #eee; }
    .title { margin: 0; font-size: 1.25rem; font-weight: 600; }
    .close { border: 0; background: transparent; font-size: 1.75rem; line-height: 1; cursor: pointer; padding: .25rem .5rem; border-radius: 8px; }
    .close:focus { outline: 2px solid #4c9ffe; outline-offset: 2px; }
    .body { padding: 1rem 1.25rem; }
    .footer { padding: .75rem 1.25rem 1.25rem; border-top: 1px solid #eee; display: flex; gap: .5rem; justify-content: flex-end; }
  `]
})
export class ModalComponent implements OnChanges {
  /** Controla la visibilidad del modal */
  @Input() open = false;
  /** Título accesible (se une con aria-labelledby) */
  @Input() title = 'Modal';
  /** Permitir cerrar al hacer click fuera */
  @Input() closeOnBackdrop = true;

  /** Two-way binding: [(open)] */
  @Output() openChange = new EventEmitter<boolean>();
  /** Se emite cuando el modal terminó de abrir */
  @Output() opened = new EventEmitter<void>();
  /** Se emite cuando el modal se cierra */
  @Output() closed = new EventEmitter<void>();

  @ViewChild('dialogEl') dialogEl?: ElementRef<HTMLDivElement>;
  @ViewChild('panel') panel?: ElementRef<HTMLDivElement>;

  titleId = `modal-title-${Math.random().toString(36).slice(2)}`;
  descriptionId = `modal-desc-${Math.random().toString(36).slice(2)}`;

  private lastFocused: HTMLElement | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']) {
      if (this.open) {
        // Guardar foco previo y bloquear scroll de body
        this.lastFocused = document.activeElement as HTMLElement;
        setTimeout(() => { this.focusFirst(); this.opened.emit(); }, 0);
        try { document.body.style.overflow = 'hidden'; } catch {}
      } else {
        // Restaurar scroll y foco
        try { document.body.style.overflow = ''; } catch {}
        this.restoreFocus();
      }
    }
  }

  /** Cierra el modal programáticamente */
  close(): void {
    if (!this.open) return;
    this.open = false;
    this.openChange.emit(false);
    this.closed.emit();
  }

  /** Abre el modal programáticamente */
  openModal(): void {
    if (this.open) return;
    this.open = true;
    this.openChange.emit(true);
  }

  /** Click en backdrop */
  backdropClick(): void {
    if (this.closeOnBackdrop) this.close();
  }

  /** Accesibilidad: ESC para cerrar + trap de TAB dentro del modal */
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.stopPropagation();
      this.close();
      return;
    }
    if (event.key === 'Tab') {
      const container = this.panel?.nativeElement || this.dialogEl?.nativeElement;
      if (!container) return;

      const all = Array.from(
        container.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => !el.hasAttribute('disabled') && this.isVisible(el));

      if (all.length === 0) {
        event.preventDefault();
        (container as HTMLElement).focus();
        return;
      }

      const first = all[0];
      const last = all[all.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      }
    }
  }

  /** Enfoca el primer elemento interactivo o el panel */
  private focusFirst(): void {
    const container = this.panel?.nativeElement || this.dialogEl?.nativeElement;
    if (!container) return;

    const first = Array.from(
      container.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).find(el => !el.hasAttribute('disabled') && this.isVisible(el));

    (first || container).focus();
  }

  private restoreFocus(): void {
    try { this.lastFocused?.focus(); } catch {}
    this.lastFocused = null;
  }

  private isVisible(el: HTMLElement): boolean {
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
  }
}
