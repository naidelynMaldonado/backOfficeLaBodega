import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CKEditorModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('La Bodega BackOffice');
}
