import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DrawerComponent } from '../../../../shared/components/drawer/drawer.component';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { RolesService } from '../roles.service';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  standalone: true,
  imports: [CommonModule, DrawerComponent, ReactiveFormsModule]
})
export class EditRoleComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  /** Two-way open binding forwarded to inner <drawer> */
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<any>();

  /** Optional title for create/edit mode */
  @Input() title = 'Editar Rol';
  @Input() role?: any;

  // Form & permisos
  form: FormGroup;
  permissionModules: any[] = [];
  isLoadingPermissions = false;
  savingRole = false;

  constructor(private rolesService: RolesService, private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['']
    });
  }

  @ViewChild(DrawerComponent) innerDrawer?: DrawerComponent;
  private subs: Subscription[] = [];

  ngAfterViewInit(): void {
  // Not using runtime EventEmitter subscriptions here. The template now forwards events
  // to onInnerOpenChange and onInnerClosed handlers which forward to parent and reset state.
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  /** Close drawer via inner drawer API so it emits its own events */
  closeDrawer(){
    if (this.innerDrawer && typeof this.innerDrawer.close === 'function') {
  this.innerDrawer.close();
    } else {
      // fallback: update local state and emit
  this.open = false;
  this.openChange.emit(false);
  // reset selections when closed via fallback
  this.resetPermissionSelections();
    }
  }

  ngOnInit() {
    // permissions are loaded when the drawer opens (see ngOnChanges)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['role'] && !changes['role'].isFirstChange()) {
      // If a role is assigned after init and permissions already loaded, map immediately.
      if (this.permissionModules && this.permissionModules.length) {
        this.loadRoleAssignedPermissionsIfNeeded();
      }
    }
    if (changes['open'] && changes['open'].currentValue === true) {
      // When drawer opens, load the permission catalog and then map assigned permissions (if any).
      this.isLoadingPermissions = true;
      this.rolesService.getPermisos().pipe().subscribe({
        next: (permisos: any[]) => {
          this.permissionModules = permisos || [];
          this.buildPermissionControls();
          // only map role-assigned permissions after controls are built
          this.loadRoleAssignedPermissionsIfNeeded();
          this.isLoadingPermissions = false;
        },
        error: (err: any) => {
      // when drawer closes, clear selections so reopening starts fresh (and mapping will reapply if role exists)
      if (changes['open'] && changes['open'].currentValue === false) {
        this.resetPermissionSelections();
      }
          console.error('Error al cargar permisos:', err);
          this.isLoadingPermissions = false;
        }
      });
    }
  }

  // Handler called from template when inner drawer open state changes
  onInnerOpenChange(open: boolean){
    this.openChange.emit(open);
  }

  // Handler called when inner drawer emits closed()
  onInnerClosed(){
    // Forward closed to parent and reset selections so drawer can reopen cleanly
    this.openChange.emit(false);
    this.resetPermissionSelections();
  }

  /** If `role` input is provided, load its assigned permissions and set controls */
  private loadRoleAssignedPermissionsIfNeeded() {
    if (!this.role || !this.role.id) return;
    // call service which returns a role object with assigned modules/actions
    this.rolesService.loadRolePermissions(this.role.id).pipe().subscribe({
      next: (roleResp: any) => {
        try {
          // set nombre if present
          if (roleResp.rolnombre) this.form.get('nombre')?.setValue(roleResp.rolnombre);

          // The API may return assigned modules/actions in different shapes.
          // Common patterns handled:
          // 1) roleResp.modules: [{ permisomoduloid }]
          // 2) roleResp.actions: [{ permisoaccionid, permisomoduloid }]
          // 3) roleResp.permisos: { modules: [...], actions: [...] }

          const moduleIds = new Set<number>();
          const actionPairs = new Set<string>();
          const actionIdsOnly = new Set<number>();

          // Reset any existing module/submodule/action controls to false before mapping
          Object.keys(this.form.controls).forEach(k => {
            if (k.startsWith('module_') || k.startsWith('submodule_') || k.startsWith('action_')) {
              this.form.get(k)?.setValue(false);
            }
          });

          // collect modules array and nested submodules/actions
          if (Array.isArray(roleResp.modules)) {
            roleResp.modules.forEach((m: any) => {
              const mid = Number(m.permisomoduloid ?? m.id ?? m);
              if (!isNaN(mid)) moduleIds.add(mid);
              // submodules
              if (Array.isArray(m.submodule)) {
                m.submodule.forEach((s: any) => {
                  const sid = Number(s.permisomoduloid ?? s.id ?? s);
                  if (!isNaN(sid)) moduleIds.add(sid);
                  // actions inside submodule
                  if (Array.isArray(s.actions)) {
                    s.actions.forEach((a: any) => {
                      const aid = Number(a.permisoaccionid ?? a.id ?? a);
                      if (!isNaN(aid)) actionPairs.add(`${aid}|${sid}`);
                    });
                  }
                });
              }
              // actions directly under module
              if (Array.isArray(m.actions)) {
                m.actions.forEach((a: any) => {
                  const aid = Number(a.permisoaccionid ?? a.id ?? a);
                  if (!isNaN(aid)) actionPairs.add(`${aid}|${mid}`);
                });
              }
            });
          }
          // collect actions which may include the module/submodule id
          if (Array.isArray(roleResp.actions)) {
            roleResp.actions.forEach((a: any) => {
              const actId = Number(a.permisoaccionid ?? a.id ?? a);
              const modId = Number(a.permisomoduloid ?? a.moduloId ?? a.parentId ?? NaN);
              if (!isNaN(modId)) {
                actionPairs.add(`${actId}|${modId}`);
              } else {
                actionIdsOnly.add(actId);
              }
            });
          }
          if (roleResp.permisos) {
            const p = roleResp.permisos;
            if (Array.isArray(p.modules)) p.modules.forEach((m: any) => moduleIds.add(Number(m.permisomoduloid ?? m.id ?? m)));
            if (Array.isArray(p.actions)) p.actions.forEach((a: any) => {
              const actId = Number(a.permisoaccionid ?? a.id ?? a);
              const modId = Number(a.permisomoduloid ?? a.moduloId ?? a.parentId ?? NaN);
              if (!isNaN(modId)) actionPairs.add(`${actId}|${modId}`); else actionIdsOnly.add(actId);
            });
          }

          // Now traverse the permissionModules and set controls based on collected ids
          this.permissionModules.forEach((mod: any) => {
            const modId = mod.id || mod.permisomoduloid || mod.moduloId || mod.idModulo;
            const modKey = `module_${modId}`;
            // If module explicitly assigned
            if (moduleIds.has(modId)) {
              if (this.form.contains(modKey)) this.form.get(modKey)?.setValue(true);
            }

            // Check submodules
            mod.submodule?.forEach((sub: any) => {
              const subId = sub.id || sub.permisomoduloid || sub.moduloId || sub.idModulo;
              const subKey = `submodule_${subId}`;
              if (moduleIds.has(subId)) {
                if (this.form.contains(subKey)) this.form.get(subKey)?.setValue(true);
                if (this.form.contains(modKey)) this.form.get(modKey)?.setValue(true);
              }

              // actions inside submodule
              sub.actions?.forEach((act: any) => {
                const actId = act.id || act.permisoaccionid || act.accionId || act.idAccion || act;
                const actionKey = `action_${actId}`;
                const pair1 = `${actId}|${subId}`;
                const pair2 = `${actId}|${modId}`; // sometimes module id used
                if (actionPairs.has(pair1) || actionPairs.has(pair2) || actionIdsOnly.has(actId)) {
                  if (this.form.contains(actionKey)) this.form.get(actionKey)?.setValue(true);
                  if (this.form.contains(subKey)) this.form.get(subKey)?.setValue(true);
                  if (this.form.contains(modKey)) this.form.get(modKey)?.setValue(true);
                }
              });
            });

            // actions directly under module
            mod.actions?.forEach((act: any) => {
              const actId = act.id || act.permisoaccionid || act.accionId || act.idAccion || act;
              const actionKey = `action_${actId}`;
              const pair = `${actId}|${modId}`;
              if (actionPairs.has(pair) || actionIdsOnly.has(actId)) {
                if (this.form.contains(actionKey)) this.form.get(actionKey)?.setValue(true);
                if (this.form.contains(modKey)) this.form.get(modKey)?.setValue(true);
              }
            });
          });
        } catch (e) {
          console.error('Error mapeando permisos del rol:', e);
        }
      },
      error: (err: any) => console.error('Error cargando permisos del rol:', err)
    });
  }

  // permissions are loaded on drawer open via ngOnChanges; this method kept for compatibility if needed
  loadPermissions() {
    this.isLoadingPermissions = true;
    return this.rolesService.getPermisos();
  }

  buildPermissionControls() {
    this.permissionModules.forEach((module: any) => {
      const modId = module.id || module.permisomoduloid || module.moduloId || module.idModulo;
      const keyModule = `module_${modId}`;
      if (!this.form.contains(keyModule)) this.form.addControl(keyModule, new FormControl(false));
      module.submodule?.forEach((submodule: any) => {
        const subId = submodule.id || submodule.permisomoduloid || submodule.moduloId || submodule.idModulo;
        const keySub = `submodule_${subId}`;
        if (!this.form.contains(keySub)) this.form.addControl(keySub, new FormControl(false));

        submodule.actions?.forEach((action: any) => {
          const actId = action.id || action.permisoaccionid || action.accionId || action.idAccion || action;
          const keyAction = `action_${actId}`;
          if (!this.form.contains(keyAction)) this.form.addControl(keyAction, new FormControl(false));
        });
      });

      module.actions?.forEach((action: any) => {
        const actId = action.id || action.permisoaccionid || action.accionId || action.idAccion || action;
        const keyAction = `action_${actId}`;
        if (!this.form.contains(keyAction)) this.form.addControl(keyAction, new FormControl(false));
      });
    });
  }

  // Handlers para checkboxes
  onMainModuleChange(module: any, event: any) {
    const checked = event.target.checked;
    if (checked) {
      module.submodule?.forEach((s: any) => this.form.get(`submodule_${s.id}`)?.setValue(true));
      module.actions?.forEach((a: any) => this.form.get(`action_${a.id}`)?.setValue(true));
    } else {
      module.submodule?.forEach((s: any) => {
        this.form.get(`submodule_${s.id}`)?.setValue(false);
        s.actions?.forEach((a: any) => this.form.get(`action_${a.id}`)?.setValue(false));
      });
      module.actions?.forEach((a: any) => this.form.get(`action_${a.id}`)?.setValue(false));
    }
  }

  onSubModuleChange(module: any, submodule: any, event: any) {
    const checked = event.target.checked;
    if (checked) {
  submodule.actions?.forEach((a: any) => this.form.get(`action_${a.id}`)?.setValue(true));
      // marcar el módulo cuando al menos un submódulo está marcado
      if (this.form.contains(`module_${module.id}`)) this.form.get(`module_${module.id}`)?.setValue(true);
    } else {
  submodule.actions?.forEach((a: any) => this.form.get(`action_${a.id}`)?.setValue(false));
      // determinar si el módulo debe permanecer marcado (si queda algún submodule o acción directa marcada)
      const anySubChecked = module.submodule?.some((s: any) => this.form.get(`submodule_${s.id}`)?.value);
      const anyModuleActionsChecked = module.actions?.some((a: any) => this.form.get(`action_${a.id}`)?.value);
      if (!anySubChecked && !anyModuleActionsChecked) {
        if (this.form.contains(`module_${module.id}`)) this.form.get(`module_${module.id}`)?.setValue(false);
      }
    }
  }

  onActionChange(module: any, submodule: any | null, action: any, event: any) {
    const checked = event.target.checked;
    if (submodule) {
      if (checked) {
        // si se marca cualquier acción, marcar su submódulo y módulo
        if (this.form.contains(`submodule_${submodule.id}`)) this.form.get(`submodule_${submodule.id}`)?.setValue(true);
        if (this.form.contains(`module_${module.id}`)) this.form.get(`module_${module.id}`)?.setValue(true);
      } else {
        // si se desmarca, revisar si quedan acciones en el submódulo
        const anyActionInSubChecked = submodule.actions?.some((act: any) => this.form.get(`action_${act.id}`)?.value);
        if (!anyActionInSubChecked) {
          if (this.form.contains(`submodule_${submodule.id}`)) this.form.get(`submodule_${submodule.id}`)?.setValue(false);
        }
        // revisar si el módulo aún debe estar marcado
        const anySubChecked = module.submodule?.some((s: any) => this.form.get(`submodule_${s.id}`)?.value);
        const anyModuleActionsChecked = module.actions?.some((a: any) => this.form.get(`action_${a.id}`)?.value);
        if (!anySubChecked && !anyModuleActionsChecked) {
          if (this.form.contains(`module_${module.id}`)) this.form.get(`module_${module.id}`)?.setValue(false);
        }
      }
    } else {
      // action belongs to module directly
  if (checked) {
    if (this.form.contains(`module_${module.id}`)) this.form.get(`module_${module.id}`)?.setValue(true);
  } else {
    const anyModuleActionsChecked = module.actions?.some((act: any) => this.form.get(`action_${act.id}`)?.value);
    const anySubChecked = module.submodule?.some((s: any) => this.form.get(`submodule_${s.id}`)?.value);
    if (!anyModuleActionsChecked && !anySubChecked) {
      if (this.form.contains(`module_${module.id}`)) this.form.get(`module_${module.id}`)?.setValue(false);
    }
  }
    }
  }

  /** Reset all module/submodule/action selections and clear name (used on close) */
  private resetPermissionSelections() {
    try {
      Object.keys(this.form.controls).forEach(k => {
        if (k.startsWith('module_') || k.startsWith('submodule_') || k.startsWith('action_')) {
          this.form.get(k)?.setValue(false);
        }
      });
      if (this.form.contains('nombre')) this.form.get('nombre')?.setValue('');
    } catch (e) {
      // ignore reset errors
    }
  }

  save() {
    if (this.form.invalid) return;
    const formValue = this.form.value;

    const moduleSet = new Set<number>();
    const actionSet = new Set<string>(); // actionId|moduleId

    this.permissionModules.forEach((module: any) => {
      const moduleKey = `module_${module.id}`;
      if (formValue[moduleKey]) moduleSet.add(module.id);

      module.submodule?.forEach((sub: any) => {
        const subKey = `submodule_${sub.id}`;
        if (formValue[subKey]) {
          moduleSet.add(sub.id);
          moduleSet.add(module.id);
        }
        sub.actions?.forEach((act: any) => {
          const actionKey = `action_${act.id}`;
          if (formValue[actionKey]) {
            actionSet.add(`${act.id}|${sub.id}`);
            moduleSet.add(sub.id);
            moduleSet.add(module.id);
          }
        });
      });

      module.actions?.forEach((act: any) => {
        const actionKey = `action_${act.id}`;
        if (formValue[actionKey]) {
          actionSet.add(`${act.id}|${module.id}`);
          moduleSet.add(module.id);
        }
      });
    });

    const actions: any[] = [];
    actionSet.forEach(k => {
      const [actionIdStr, moduleIdStr] = k.split('|');
      actions.push({ permisoaccionid: Number(actionIdStr), permisomoduloid: Number(moduleIdStr) });
    });

    const modules = Array.from(moduleSet).map(id => ({ permisomoduloid: id }));

    const payload = {
      rolnombre: formValue.nombre,
      activo: true,
      modules,
      actions
    };

    const roleId = this.role?.id;
    this.savingRole = true;
    this.rolesService.saveRole(payload, roleId).pipe(finalize(() => this.savingRole = false)).subscribe({
      next: (resp: any) => {
        console.log('Rol guardado:', resp);
        this.saved.emit(resp);
        this.closeDrawer();
      },
      error: (err: any) => console.error('Error guardando rol:', err)
    });
  }

  cancel() {
    this.closeDrawer();
  }


}
