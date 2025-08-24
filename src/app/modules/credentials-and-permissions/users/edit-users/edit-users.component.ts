import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DrawerComponent } from '../../../../shared/components/drawer/drawer.component';
import { RolesService } from '../../roles/roles.service';
import { UserService } from '../users.service';

@Component({
  selector: 'app-edit-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DrawerComponent],
  templateUrl: './edit-users.component.html'
})
export class EditUsersComponent implements OnChanges {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Input() title = 'Editar Usuario';
  @Input() user?: any;
  @Output() saved = new EventEmitter<any>();

  @ViewChild(DrawerComponent) innerDrawer?: DrawerComponent;

  form: FormGroup;
  roles: any[] = [];
  loadingRoles = false;

  saving = false;

  constructor(private fb: FormBuilder, private rolesService: RolesService, private userService: UserService) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      telefono: [''],
      email: ['', [Validators.required, Validators.email]],
      rolId: [null, Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && changes['open'].currentValue === true) {
      // load roles when opening
      this.loadingRoles = true;
      this.rolesService.fetchRoles().subscribe({
        next: (r: any[]) => { this.roles = r || []; this.loadingRoles = false; this.mapUser(); },
        error: () => { this.loadingRoles = false; this.mapUser(); }
      });
    }
    if (changes['user'] && !changes['user'].isFirstChange()) {
      this.mapUser();
    }
  }

  private mapUser() {
    if (!this.user) {
      this.form.reset();
      return;
    }
    this.form.patchValue({
      nombre: this.user.nombre ?? this.user.displayName ?? '',
      telefono: this.user.telefono ?? '',
      email: this.user.email ?? '',
      rolId: this.user.rolId ?? this.user.roleId ?? null
    });
  }

  closeDrawer(){
    if (this.innerDrawer && typeof this.innerDrawer.close === 'function') { this.innerDrawer.close(); }
    else { this.open = false; this.openChange.emit(false); }
  }

  save(){
    if (this.form.invalid) return;
    const v = this.form.value;
    this.saving = true;
    const usuario = sessionStorage.getItem('usuario') || '';

    if (this.user && this.user.id) {
      // update
      const updatePayload = {
        data: {
          id: this.user.id,
          nombre: v.nombre,
          telefono: v.telefono || '',
          password: this.user.password || '',
          correo_electronico: v.email,
          estado: this.user.estado ?? true,
          permisos: []
        },
        usuario
      };
      this.userService.updateColaborador(updatePayload).pipe().subscribe({
        next: (resp: any) => {
          this.saving = false;
          this.saved.emit(resp);
          this.closeDrawer();
        },
        error: (err: any) => { this.saving = false; console.error('Error actualizando usuario:', err); }
      });
    } else {
      // create
      const newPayload = {
        data: [{
          nombre: v.nombre,
          telefono: v.telefono || '',
          password: v.password || 'changeme',
          correo_electronico: v.email,
          estado: true,
          permisos: []
        }],
        usuario
      };
      this.userService.newColaborador(newPayload).pipe().subscribe({
        next: (resp: any) => {
          this.saving = false;
          this.saved.emit(resp);
          this.closeDrawer();
        },
        error: (err: any) => { this.saving = false; console.error('Error creando usuario:', err); }
      });
    }
  }

  cancel(){ this.closeDrawer(); }
}
