export interface RouletteAwards{
    id: number
    monto_minimo: string
    image_url: string
    regalo_del_dia: string
    sku_regalo: string
    existencia_regalo: number
    estado_regalo: boolean
    cod_producto: number
}

export interface RouletteConfig {
    id: number
    tipo_premio: string
    info_adicional?: string
    cantidad: number
    cod_producto: number
    color_background: string,
    color_label: string,
    estado: boolean,
    no_posicion: number,
  }