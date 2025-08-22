import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatChipsModule],
  template: `
    <div class="p-6">
      dashboard
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class DashboardComponent implements OnInit {
  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    // this.loadingService.onLoading(); // Activate loading on init
  }
}
