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
  loadingUser = false;

  saving = false;

  constructor(private fb: FormBuilder, private rolesService: RolesService, private userService: UserService) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      telefono: [''],
      email: ['', [Validators.required, Validators.email]],
      rolId: [null, Validators.required]
    });
  // ensure form disabled state follows flags at startup
  this.updateFormDisabledState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && changes['open'].currentValue === true) {
      // load roles when opening
      this.loadingRoles = true;
  this.updateFormDisabledState();
      this.rolesService.fetchRoles().subscribe({
  next: (r: any[]) => { this.roles = r || []; this.loadingRoles = false; this.mapUser(); this.updateFormDisabledState(); },
  error: () => { this.loadingRoles = false; this.mapUser(); this.updateFormDisabledState(); }
      });
      // if drawer opened and a user id is present, fetch full details
      this.loadUserDetailIfNeeded();
    }
    if (changes['user'] && !changes['user'].isFirstChange()) {
      this.mapUser();
      // if user input changes and contains id, fetch full details
      this.loadUserDetailIfNeeded();
    }
  }

  private loadUserDetailIfNeeded() {
    const id = this.user?.id;
    if (!id) return;
  this.loadingUser = true;
  this.updateFormDisabledState();
    this.userService.getColaboradorDetail(id).subscribe({
      next: (detail: any) => {
        try {
          // map detalle fields to form; prefer detail values but keep role from this.user if present
          this.form.patchValue({
            nombre: detail.nombre ?? this.form.get('nombre')?.value,
            telefono: detail.telefono ?? this.form.get('telefono')?.value,
            email: detail.correo_electronico ?? this.form.get('email')?.value,
            // role id may be on this.user (shallow) or returned elsewhere; keep existing if detail doesn't include it
            rolId: (this.user && (this.user.rolid ?? this.user.rolId)) ?? this.form.get('rolId')?.value
          });
        } catch (e) { console.error('Error mapeando detalle de colaborador:', e); }
        this.loadingUser = false;
        this.updateFormDisabledState();
      },
      error: (err: any) => { this.loadingUser = false; this.updateFormDisabledState(); console.error('Error cargando detalle del colaborador:', err); }
    });
  }

  private mapUser() {
    if (!this.user) {
      this.form.reset();
  this.updateFormDisabledState();
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
  this.updateFormDisabledState();
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
          this.updateFormDisabledState();
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
          this.updateFormDisabledState();
          this.saved.emit(resp);
          this.closeDrawer();
        },
        error: (err: any) => { this.saving = false; console.error('Error creando usuario:', err); }
      });
    }
  }

  private updateFormDisabledState(){
    // Disable the whole form while any async flag is true to avoid template [disabled] usages
    if (this.loadingRoles || this.loadingUser || this.saving){
      try { this.form.disable({ emitEvent: false }); } catch(e) { /* ignore */ }
    } else {
      try { this.form.enable({ emitEvent: false }); } catch(e) { /* ignore */ }
    }
  }

  cancel(){ this.closeDrawer(); }

  // template-forwarded handlers for inner drawer events
  onInnerOpenChange(open: boolean){
    this.openChange.emit(open);
  }

  onInnerClosed(){
    // ensure form is reset when drawer closes internally so it can be reopened
    this.openChange.emit(false);
    try { this.form.reset(); } catch(e) { /* ignore */ }
    // ensure flags cleared
    this.loadingRoles = false; this.loadingUser = false; this.saving = false;
    this.updateFormDisabledState();
  }
}
