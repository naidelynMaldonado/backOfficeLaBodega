import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { take, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserService } from './users.service';
import { ApiUser, Colaboradores, removeColaborador, updatePassword } from './users.types';
import { RemoveUserComponent } from './remove-user/remove-user.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditUsersComponent } from './edit-users/edit-users.component';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  standalone: true,
  imports: [MatDialogModule, MatMenuModule, EditUsersComponent, CommonModule]
})
export class UsersComponent implements OnInit {
colaboradores: Colaboradores[] = [];
  editOpen = false;
  selectedUser: any = null;

  constructor(
    public usersService: UserService,
    public dialog: MatDialog,
    private router: Router,
    // private alertService: AlertService,
    private http: HttpClient,
  ) {}
  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    const url = `${environment.apiURL}/users`;
    this.http.get<ApiUser[]>(url).pipe(take(1)).subscribe({
      next: (apiUsers: ApiUser[]) => {
        // Mapear de la estructura del API a la estructura local
        this.colaboradores = apiUsers.map(apiUser => ({
          id: apiUser.id,
          nombre: apiUser.nombre,
          telefono: apiUser.telefono,
          password: apiUser.password,
          correo_electronico: apiUser.correo_electronico,
          estado: apiUser.estado,
          modificacionfecha: apiUser.modificacionfecha,
          modificacionusuario: apiUser.modificacionusuario,
          rolid: apiUser.rolid,
          rolnombre: apiUser.rolnombre // Nuevo campo del rol
        }));
        console.log('Usuarios cargados:', this.colaboradores);
      },
      error: (err: any) => {
        console.error('Error al cargar usuarios:', err);
        // Fallback a servicio local si falla el API
        this.usersService.getColaboradores().subscribe({
          next: (value: Colaboradores[]) => {
            this.colaboradores = value;
          },
          error: (err: any) => {
            console.error('Error al obtener usuarios locales:', err);
          },
        });
      }
    });
  }

  removeUser(id: number) {

    const formData: removeColaborador = {
      id: id,
      usuario: sessionStorage.getItem('usuario') || ''
    }
    const dialogRef = this.dialog.open(RemoveUserComponent, {
      width: '500px',
      data: formData,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.remove) {
        this.usersService.removeColaboradores(formData).subscribe({
          next: () => {
            this.loadUsers(); // Usar el nuevo método loadUsers
            // this.alertService.showSuccess(
            //   `Colaborador eliminado correctamente`
            // );
          },
        });
      }
    });
  }

  newUser() {
    this.selectedUser = null;
    this.editOpen = true;
  }

  editUser(id: number) {
    const user = this.colaboradores.find(u => u.id === id);
    if (user) {
      this.selectedUser = { ...user };
      this.editOpen = true;
    }
  }

  onSaved(result: any) {
    // Recargar la lista después de guardar
    this.loadUsers();
    console.log('Usuario guardado, recargando lista');
  }
}
