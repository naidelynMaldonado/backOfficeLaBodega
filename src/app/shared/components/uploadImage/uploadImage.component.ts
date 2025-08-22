import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './uploadImage.component.html',
  styleUrls: ['./uploadImage.component.css']
})
export class UploadImageComponent {
  @Input() imageUrl: string | null = null;
  @Input() placeholder: string = 'Cargar imagen';
  @Input() acceptedTypes: string = 'image/*';
  @Input() height: string = '150px';
  @Input() borderColor: string = 'border-primary-600';
  @Input() uploadIcon: string = 'upload';
  
  @Output() imageSelected = new EventEmitter<string>();
  @Output() imageRemoved = new EventEmitter<void>();

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageUrl = e.target.result;
        this.imageUrl = imageUrl;
        this.imageSelected.emit(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.imageUrl = null;
    this.imageRemoved.emit();
  }
}
