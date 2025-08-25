export interface Header {
    id: number,
    titulo: string,
    subtitulo: string,
    boton_texto: string,
    enlace_destino: string,
}

export interface Images {
    foto1: string,
    foto2: string,
    foto3: string,
}

export interface Producto {
    url_imagen: string,
    nombre: string,
    precio: string,
    precioOferta: string,
    categoria_id: number,
    activo: boolean
}

export interface Seccion {
    producto1: Producto,
    producto2: Producto,
    producto3: Producto
}

export interface Banners {
    titulo: string,
    subtitulo: string,
    boton: string,
    background: string,
    enlace: string,
    banner_photo: string,
    photo: string,
}

export interface Historia {
    titulo: string,
    parrafo: string,
    boton_texto: string,
    url_boton: string,
    url_media: string,
}