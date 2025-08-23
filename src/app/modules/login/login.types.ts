export interface LoginColaborador {
    id: number,
    nombre: string,
    correo: string,
    rolnombre: string,
    accessToken: string,
    refreshToken: string
}

export interface RefreshTokenResponse {
    accessToken: string
}

export interface Roles { 
    permiso_id: number,
    estado_permiso: boolean,
}

export interface Child {
    id: number;
    label: string;
    icon: string;
    path: string;
    state: boolean;
}

export interface Option {
    id: number;
    label: string;
    icon: string;
    path: string;
    childrens: Child[];
    state: boolean;
}
