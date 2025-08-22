# UploadImage Component

Un componente reutilizable para subir y previsualizar imágenes.

## Uso

```html
<app-upload-image
  [imageUrl]="photo"
  [placeholder]="'Cargar imagen'"
  [height]="'150px'"
  [borderColor]="'border-primary-600'"
  [uploadIcon]="'upload'"
  [acceptedTypes]="'image/*'"
  (imageSelected)="onImageSelected($event)"
  (imageRemoved)="onImageRemoved()"
></app-upload-image>
```

## Propiedades de entrada (@Input)

| Propiedad | Tipo | Valor por defecto | Descripción |
|-----------|------|-------------------|-------------|
| `imageUrl` | `string \| null` | `null` | URL de la imagen actual |
| `placeholder` | `string` | `'Cargar imagen'` | Texto que se muestra cuando no hay imagen |
| `acceptedTypes` | `string` | `'image/*'` | Tipos de archivo aceptados |
| `height` | `string` | `'150px'` | Altura del contenedor |
| `borderColor` | `string` | `'border-primary-600'` | Color del borde (clase Tailwind) |
| `uploadIcon` | `string` | `'upload'` | Icono SVG para el upload |

## Eventos de salida (@Output)

| Evento | Tipo | Descripción |
|--------|------|-------------|
| `imageSelected` | `EventEmitter<string>` | Se emite cuando se selecciona una imagen (devuelve la URL data) |
| `imageRemoved` | `EventEmitter<void>` | Se emite cuando se elimina la imagen |

## Ejemplo de implementación

```typescript
export class MiComponente {
  photo: string | null = null;

  onImageSelected(imageUrl: string) {
    this.photo = imageUrl;
    console.log('Imagen seleccionada:', imageUrl);
  }

  onImageRemoved() {
    this.photo = null;
    console.log('Imagen eliminada');
  }
}
```

## Características

- ✅ Drag & drop visual feedback
- ✅ Previsualización de imagen
- ✅ Botón de eliminar con hover
- ✅ Completamente personalizable
- ✅ Standalone component (Angular 14+)
- ✅ Responsive design
- ✅ Tipos de archivo configurables
