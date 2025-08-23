import { Component, OnInit, ViewChild } from '@angular/core';
import { RolesService } from './roles.service';
import { rol } from './roles.types';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { EditRoleComponent } from './edit-role/edit-role.component';
import { LoadingService } from '../../../core/services/loading.service';

interface ApiRole {
  rolid: number;
  rolnombre: string;
  activo: boolean;
}

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
  standalone: true,
  imports: [MatIconModule, CommonModule, MatMenuModule, EditRoleComponent]
})
export class RolesComponent implements OnInit {

  roles: rol[] = [];
  selectedRole: rol | null = null;
  // Control para el drawer de creación/edición
  editDrawerOpen = false;
  editDrawerTitle = 'Editar Rol';


  constructor(
  private rolesService: RolesService, 
  private loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.rolesService.fetchRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error: any) => {
        console.error('Error al cargar roles desde API, usando fallback local:', error);
      }
    });
  }

  // columnas para la tabla
  displayedColumns: string[] = ['id', 'nombre', 'estado', 'acciones'];

  onToggleActive(r: rol) {
    const newStatus = r.estado === 'activo' ? false : true;
    this.rolesService.toggleRoleActive(r.id, newStatus).subscribe({
      next: () => {
        // Recargar la lista para reflejar el cambio
        this.loadRoles();
      },
      error: (error: any) => {
        console.error('Error al cambiar estado del rol:', error);
      }
    });
  }

  onNew() {
  // Abrir drawer en modo creación
  this.selectedRole = null;
  this.editDrawerTitle = 'Crear Rol';
  this.editDrawerOpen = true;
  }

  onSaved(result: any) {
    // Recargar la lista después de guardar
    this.loadRoles();
    console.log('Rol guardado, recargando lista');
  }

  selectRole(r: rol) {
    this.selectedRole = r;
  }

  onEditSelected() {
    if (this.selectedRole) {
      this.editDrawerTitle = 'Editar Rol';
      this.editDrawerOpen = true;
    }
  }

  onToggleActiveSelected() {
    if (this.selectedRole) {
      this.onToggleActive(this.selectedRole);
    }
  }

}
