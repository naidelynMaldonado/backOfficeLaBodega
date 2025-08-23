import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DrawerComponent } from '../../../../shared/components/drawer/drawer.component';
import { Subscription } from 'rxjs';
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

  constructor(private rolesService: RolesService, private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['']
    });
  }

  @ViewChild(DrawerComponent) innerDrawer?: DrawerComponent;
  private subs: Subscription[] = [];

  ngAfterViewInit(): void {
    if (!this.innerDrawer) return;
    // Forward openChange and closed events from inner drawer to parent
    const s1 = new Subscription();
    // The drawer exposes openChange via EventEmitter; we can listen by overriding its openChange
    // but since it's a simple class we can patch by assigning a listener via the element's native EventEmitter
    // Use a crude approach: subscribe to closed via instance event emitter
    try {
      // @ts-ignore - access to EventEmitter
      if (this.innerDrawer.openChange && (this.innerDrawer.openChange as any).subscribe) {
        (this.innerDrawer.openChange as any).subscribe((v: boolean) => {
          this.openChange.emit(v);
        });
      }
      if (this.innerDrawer.closed && (this.innerDrawer.closed as any).subscribe) {
        (this.innerDrawer.closed as any).subscribe(() => {
          this.openChange.emit(false);
        });
      }
    } catch (e) { /* ignore subscribe failures */ }
    this.subs.push(s1);
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
          console.error('Error al cargar permisos:', err);
          this.isLoadingPermissions = false;
        }
      });
    }
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
      // si todos los submodules están marcados, marcar el módulo
      const allSub = module.submodule?.every((s: any) => this.form.get(`submodule_${s.id}`)?.value);
      if (allSub) this.form.get(`module_${module.id}`)?.setValue(true);
    } else {
  submodule.actions?.forEach((a: any) => this.form.get(`action_${a.id}`)?.setValue(false));
      this.form.get(`module_${module.id}`)?.setValue(false);
    }
  }

  onActionChange(module: any, submodule: any | null, action: any, event: any) {
    const checked = event.target.checked;
    if (submodule) {
      const allActions = submodule.actions?.every((act: any) => this.form.get(`action_${act.id}`)?.value);
      if (allActions) this.form.get(`submodule_${submodule.id}`)?.setValue(true);

  const allSubmodules = module.submodule?.every((s: any) => this.form.get(`submodule_${s.id}`)?.value);
      if (allSubmodules) this.form.get(`module_${module.id}`)?.setValue(true);
      if (!checked) {
        this.form.get(`submodule_${submodule.id}`)?.setValue(false);
        this.form.get(`module_${module.id}`)?.setValue(false);
      }
    } else {
      // action belongs to module directly
  const allModuleActions = module.actions?.every((act: any) => this.form.get(`action_${act.id}`)?.value);
      if (allModuleActions) this.form.get(`module_${module.id}`)?.setValue(true);
      if (!checked) this.form.get(`module_${module.id}`)?.setValue(false);
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
    this.rolesService.saveRole(payload, roleId).pipe().subscribe({
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
