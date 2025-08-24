import { Component, inject, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from '../../../../shared/components/iconSvg/iconSvg.component';
import { AuthService } from '../../../auth/auth.service';
import { LoginService } from '../../../../modules/login/login.service';

import { navigationData } from '../../../navigation';
import { NavigationItem } from '../../../navigation/navigation.types';

@Component({
  selector: 'lb-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, MatExpansionModule, SvgIconComponent],
  templateUrl: './sidebar.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
    :host { 
  display: block; 
  height: 100%;
  box-sizing: border-box;
    }
    
    /* Contenedor principal */
    .sidebar-container {
      width: 250px;
      flex: 0 0 250px; /* prevent flex containers from resizing the sidebar */
      box-sizing: border-box;
      background-color: #063289 !important;
      height: 100%;
      overflow-y: auto;
      /* reserve scrollbar gutter to avoid layout shift when scroll appears */
      scrollbar-gutter: stable both-edges;
      position: relative;
      padding-bottom: 60px; /* Espacio para el botón de logout */
    }
    
    /* Header con logo */
    .sidebar-header {
      width: 100%;
      height: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .sidebar-logo {
      width: 105px;
      height: 40px;
      object-fit: contain;
      cursor: pointer;
    }
    
    /* Items de navegación */
    .nav-item {
      width: 100%;
      height: 72px;
      display: flex;
      gap: 8px;
      align-items: center;
      font-size: 14px;
      padding-left: 24px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
  box-sizing: border-box;
    }
    
    .nav-item.active {
      color: #063289 !important;
      background-color: white !important;
    }
    
    .nav-item:not(.active) {
      color: white !important;
      background-color: #063289 !important;
    }
    
    .nav-item:not(.active):hover {
      color: #063289 !important;
      background-color: white !important;
    }
    
    /* Items hijos */
    .nav-child-item {
      width: 100%;
      height: 72px;
      display: flex;
      gap: 8px;
      align-items: center;
      font-size: 14px;
      padding-left: 44px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
  box-sizing: border-box;
    }
    
    .nav-child-item.active {
      color: #063289 !important;
      background-color: white !important;
    }
    
    .nav-child-item:not(.active) {
      color: white !important;
      background-color: #063289 !important;
    }
    
    .nav-child-item:not(.active):hover {
      color: #063289 !important;
      background-color: white !important;
    }
    
    /* Iconos */
    .nav-icon {
      width: 16px !important;
      height: 20px !important;
      margin: 0 !important;
      padding: 0 !important;
      font-size: 16px !important;
    }
    
    /* Material Expansion Panel overrides */
    .mat-expansion-panel {
  background: #063289 !important;
      color: white !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      margin: 0 !important;
      min-height: 72px !important;
  width: 100% !important;
  box-sizing: border-box !important;
    }
    
    .mat-expansion-panel-header {
      background: #063289 !important;
      color: white !important;
      border-radius: 0 !important;
      padding-left: 24px !important;
      font-size: 14px !important;
      min-height: 72px !important;
    }
    
    .mat-expansion-panel-header:hover {
      background: rgba(255,255,255,0.1) !important;
    }
    
    .mat-expansion-panel-content {
      background: #063289 !important;
    }
    
    .mat-expansion-panel-body {
      padding: 0 !important;
      box-sizing: border-box !important;
    }

    /* Ensure all elements inside expansion panels use border-box so width calculations are stable */
    .mat-expansion-panel, .mat-expansion-panel *, ::ng-deep .mat-expansion-panel, ::ng-deep .mat-expansion-panel * {
      box-sizing: border-box !important;
    }
    
    .mat-expansion-panel-header .mat-content {
      color: white !important;
    }
    
    /* Espaciado mejorado para expansion panels con mayor especificidad */
    .sidebar-container .mat-expansion-panel-header .mat-panel-title {
      display: flex !important;
      align-items: center !important;
      gap: 16px !important;
      width: 100% !important;
    }
    
    .sidebar-container .mat-expansion-panel-header .mat-panel-title .nav-icon {
      margin: 0 !important;
      flex-shrink: 0 !important;
    }
    
    .sidebar-container .mat-expansion-panel-header .mat-panel-title .panel-text {
      flex: 1 !important;
    }
    
    /* Sobrescribir estilos específicos de Material Design */
    .sidebar-container .mat-expansion-panel .mat-expansion-panel-header .mat-panel-title {
      display: flex !important;
      align-items: center !important;
      gap: 16px !important;
      width: 100% !important;
    }
    
    /* Forzar color blanco del chevron */
    .mat-expansion-panel-header .mat-expansion-indicator::after {
      color: white !important;
    }
    
    .mat-expansion-panel-header .mat-expansion-indicator {
      color: white !important;
    }
    
    .mat-expansion-panel-header .mat-expansion-indicator svg {
      fill: white !important;
    }
    
    /* Estilos adicionales para Material Design 15+ */
    .mat-expansion-panel-header .mat-mdc-icon-button {
      color: white !important;
    }
    
    .mat-expansion-panel-header .mat-mdc-icon-button .mat-icon {
      color: white !important;
    }
    
    .mat-expansion-panel-header .mat-mdc-icon-button svg {
      fill: white !important;
    }
    
    /* Selectores más específicos para diferentes versiones de Material */
    ::ng-deep .mat-expansion-panel-header .mat-expansion-indicator {
      color: white !important;
    }
    
    ::ng-deep .mat-expansion-panel-header .mat-expansion-indicator::after {
      color: white !important;
    }
    
    ::ng-deep .mat-expansion-panel-header .mat-expansion-indicator svg {
      fill: white !important;
    }
    
    ::ng-deep .mat-expansion-panel-header .mat-mdc-icon-button {
      color: white !important;
    }
    
    ::ng-deep .mat-expansion-panel-header .mat-icon {
      color: white !important;
    }
    
    /* Espaciado específico para elementos desplegables */
    ::ng-deep .mat-expansion-panel-header .mat-panel-title {
      display: flex !important;
      align-items: center !important;
      gap: 16px !important;
      width: 100% !important;
    }
    
    ::ng-deep .mat-expansion-panel-header .mat-panel-title .nav-icon {
      margin-right: 0 !important;
      margin-left: 0 !important;
      flex-shrink: 0 !important;
    }
    
    ::ng-deep .mat-expansion-panel-header .mat-panel-title .panel-text {
      flex: 1 !important;
    }
    
    /* Sobrescribir cualquier estilo de Material que interfiera */
    ::ng-deep .mat-expansion-panel-header .mat-panel-title span.mat-content {
      overflow: visible !important;
    }
    
    /* Botón de logout */
    .logout-button {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.1) !important;
      color: white !important;
      border: none;
      padding: 16px 24px !important;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 14px;
      transition: background-color 0.2s ease;
      width: 100%;
    }
    
    .logout-button:hover {
      background: rgba(255, 255, 255, 0.2) !important;
    }
    
    .logout-button .nav-icon {
      width: 16px !important;
      height: 16px !important;
      flex-shrink: 0;
    }
    `
  ]
})
export class LbSidebarComponent {
  readonly navigation: NavigationItem[] = navigationData;
  expandedItems: Set<string | number> = new Set();
  private router = inject(Router);
  private authService = inject(AuthService);
  private loginService = inject(LoginService);

  toggleExpanded(itemId: string | number): void {
    if (this.expandedItems.has(itemId)) {
      this.expandedItems.delete(itemId);
    } else {
      this.expandedItems.add(itemId);
    }
  }

  isExpanded(itemId: string | number): boolean {
    return this.expandedItems.has(itemId);
  }

  isActiveRoute(route: string | undefined): boolean {
    if (!route) return false;
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  logout(): void {
    // Limpiar almacenamiento y luego forzar navegación a la raíz
    this.authService.logout();
    // También limpiar el estado en memoria del LoginService (BehaviorSubject)
    try {
      this.loginService.logout();
    } catch (e) {
      // Si por alguna razón LoginService no está disponible, continuamos igual
      console.warn('Sidebar.logout: LoginService.logout falló', e);
    }
    try {
  // Navegación SPA a la raíz, reemplazando el historial para evitar volver atrás
  this.router.navigateByUrl('/', { replaceUrl: true });
    } catch (e) {
      console.warn('Sidebar.logout: no se pudo navegar después de logout', e);
    }
  }
}
