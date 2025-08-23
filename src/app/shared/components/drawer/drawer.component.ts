import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

/**
 * DrawerComponent (Angular standalone, single file)
 * ------------------------------------------------
 * - Accesible (role="dialog", aria-modal, ESC para cerrar, focus trap)
 * - Desliza desde: left | right | top | bottom (placement)
 * - Tamaño configurable (width/height) con --size o [size]
 * - Backdrop con cierre opcional al hacer click
 * - Two-way binding: [(open)]
 * - Slots: [drawer-header], default body (<ng-content>), [drawer-footer]
 * - Sin dependencias externas
 *
 * Uso mínimo:
 * <app-drawer [(open)]="isOpen" title="Menú" placement="left">
 *   <div drawer-header>Header</div>
 *   Contenido
 *   <div drawer-footer>Footer</div>
 * </app-drawer>
 */
@Component({
  selector: 'drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Backdrop -->
    <div *ngIf="open && hasBackdrop" class="backdrop" (click)="close()" aria-hidden="true"></div>

    <!-- Drawer container -->
    <div *ngIf="open" class="drawer" [ngClass]="placement" role="dialog" [attr.aria-modal]="true"
         [attr.aria-labelledby]="title ? titleId : null" [attr.aria-describedby]="descriptionId"
         (keydown)="onKeydown($event)" #drawerEl>

      <div class="panel" #panel [style.--size]="size">
        <header class="header">
          <h2 class="title" [id]="titleId">{{ title }}</h2>
          <button type="button" class="close" (click)="close()" aria-label="Cerrar">×</button>
        </header>

        <section class="body" [id]="descriptionId">
          <ng-content select="[drawer-header]"></ng-content>
          <ng-content></ng-content>
        </section>

        <footer class="footer">
          <ng-content select="[drawer-footer]"></ng-content>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    :host{ --size: 360px; --radius: 16px; --shadow: 0 24px 60px rgba(0,0,0,.18); }
    .backdrop{ position:fixed; inset:0; background:rgba(0,0,0,.45); backdrop-filter: blur(1px); z-index: 999; }

    .drawer{ position: fixed; inset: 0; z-index: 1000; }
    .panel{ position:absolute; background:#fff; border-radius: var(--radius); box-shadow: var(--shadow); overflow:auto; max-width: 100vw; max-height: 100vh; }

    /* Placements */
    .left .panel{ inset: 0 auto 0 0; width: var(--size); height: 100%; border-radius: 0 var(--radius) var(--radius) 0; transform: translateX(-100%); animation: slideInLeft .22s ease-out forwards; }
    .right .panel{ inset: 0 0 0 auto; width: var(--size); height: 100%; border-radius: var(--radius) 0 0 var(--radius); transform: translateX(100%); animation: slideInRight .22s ease-out forwards; }
    .top .panel{ inset: 0 0 auto 0; height: var(--size); width: 100%; border-radius: 0 0 var(--radius) var(--radius); transform: translateY(-100%); animation: slideInTop .22s ease-out forwards; }
    .bottom .panel{ inset: auto 0 0 0; height: var(--size); width: 100%; border-radius: var(--radius) var(--radius) 0 0; transform: translateY(100%); animation: slideInBottom .22s ease-out forwards; }

    @keyframes slideInLeft{ to{ transform: translateX(0); } }
    @keyframes slideInRight{ to{ transform: translateX(0); } }
    @keyframes slideInTop{ to{ transform: translateY(0); } }
    @keyframes slideInBottom{ to{ transform: translateY(0); } }

    .header{ display:flex; align-items:center; justify-content:space-between; padding:1rem 1.25rem; border-bottom:1px solid #eee; }
    .title{ margin:0; font-size:1.1rem; font-weight:600; }
    .close{ border:0; background:transparent; font-size:1.75rem; line-height:1; cursor:pointer; padding:.25rem .5rem; border-radius:8px; }
    .close:focus{ outline:2px solid #4c9ffe; outline-offset:2px; }
    .body{ padding:1rem 1.25rem; }
    .footer{ padding:.75rem 1.25rem 1.25rem; border-top:1px solid #eee; display:flex; gap:.5rem; justify-content:flex-end; }

    /* Reduce motion */
    @media (prefers-reduced-motion: reduce){
      .left .panel, .right .panel, .top .panel, .bottom .panel{ animation-duration: .01ms; }
    }
  `]
})
export class DrawerComponent implements OnChanges {
  /** Controla la visibilidad */
  @Input() open = false;
  /** Título accesible */
  @Input() title = 'Drawer';
  /** left | right | top | bottom */
  @Input() placement: 'left'|'right'|'top'|'bottom' = 'right';
  /** Tamaño del drawer (width u height según placement) */
  @Input() size: string = '360px';
  /** Mostrar backdrop */
  @Input() hasBackdrop = true;
  /** Cerrar al click en backdrop */
  @Input() closeOnBackdrop = true;

  /** Two-way binding */
  @Output() openChange = new EventEmitter<boolean>();
  /** Eventos lifecycle */
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('drawerEl') drawerEl?: ElementRef<HTMLDivElement>;
  @ViewChild('panel') panel?: ElementRef<HTMLDivElement>;

  titleId = `drawer-title-${Math.random().toString(36).slice(2)}`;
  descriptionId = `drawer-desc-${Math.random().toString(36).slice(2)}`;

  private lastFocused: HTMLElement | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']) {
      if (this.open) {
        this.lastFocused = document.activeElement as HTMLElement;
        setTimeout(() => { this.focusFirst(); this.opened.emit(); }, 0);
        try { document.body.style.overflow = 'hidden'; } catch {}
      } else {
        try { document.body.style.overflow = ''; } catch {}
        this.restoreFocus();
      }
    }
  }

  /** Programático */
  openDrawer(){ if(this.open) return; this.open = true; this.openChange.emit(true); }
  close(){ if(!this.open) return; this.open = false; this.openChange.emit(false); this.closed.emit(); }

  onBackdrop(){ this.close(); }

  onKeydown(event: KeyboardEvent){
    if(event.key === 'Escape'){ event.stopPropagation(); this.close(); return; }
    if(event.key === 'Tab'){
      const container = this.panel?.nativeElement || this.drawerEl?.nativeElement;
      if(!container) return;
      const focusable = Array.from(container.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
        .filter(el => !el.hasAttribute('disabled') && this.isVisible(el));
      if(focusable.length === 0){ event.preventDefault(); (container as HTMLElement).focus(); return; }
      const first = focusable[0]; const last = focusable[focusable.length-1];
      const active = document.activeElement as HTMLElement | null;
      if(!event.shiftKey && active === last){ event.preventDefault(); first.focus(); }
      else if(event.shiftKey && active === first){ event.preventDefault(); last.focus(); }
    }
  }

  private focusFirst(){
    const container = this.panel?.nativeElement || this.drawerEl?.nativeElement; if(!container) return;
    const first = Array.from(container.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
      .find(el => !el.hasAttribute('disabled') && this.isVisible(el));
    (first || container).focus();
  }

  private restoreFocus(){ try { this.lastFocused?.focus(); } catch {} this.lastFocused = null; }
  private isVisible(el: HTMLElement){ const s = window.getComputedStyle(el); return s.display !== 'none' && s.visibility !== 'hidden' && el.offsetParent !== null; }
}
