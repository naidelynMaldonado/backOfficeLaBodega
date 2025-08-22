import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  selector: 'app-empty',
  template: `<main class="w-full h-screen">
    <router-outlet></router-outlet>
  </main>`,
})
export class EmptyComponent {}
