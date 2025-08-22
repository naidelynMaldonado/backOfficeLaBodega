export interface Colaboradores {
  id: number;
  nombre: string;
  telefono: string;
  password: string;
  correo_electronico: string;
  estado: boolean;
  modificacionfecha?: string;
  modificacionusuario?: string;
  rolid?: number;
  rolnombre?: string;
}

export interface Roles {
  id: number;
  nombre_permiso: string;
}

export interface RolesColaborador {
  idRol: number;
  estado: boolean;
}

export interface NuevoColaborador {
  nombre: string;
  telefono: string;
  password: string;
  correo_electronico: string;
  estado: boolean;
  permisos: Permisos[];
}

export interface Permisos {
  permiso_id: number;
  estado_permiso: boolean;
}

export interface DetalleColaborador {
  nombre: string;
  telefono: string;
  password: string;
  permisos: Permisos[];
  correo_electronico: string;
  estado: boolean;
}

export interface removeColaborador {
  id: number;
  usuario: string;
}

export interface newColaborador {
  data: NuevoColaborador[];
  usuario: string;
}

export interface updatePassword {
  to: string;
  password: string;
}

export interface updateColaborador {
  data: {
    id: number;
    nombre: string;
    telefono: string;
    password: string;
    correo_electronico: string;
    estado: boolean;
    permisos: Permisos[];
  },
  usuario: string,
}
