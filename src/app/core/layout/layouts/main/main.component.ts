import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { LbSidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { LoadingService } from '../../../services/loading.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
  standalone: true,
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  // importa los módulos necesarios para un componente standalone
  imports: [
    CommonModule,
    RouterOutlet,
    LayoutModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatIconModule,
    LbSidebarComponent,
    HeaderComponent,
    LoaderComponent
  ],
})
export class MainComponent implements AfterViewChecked {
  constructor(public loadingService: LoadingService, private cdr: ChangeDetectorRef) {}

  ngAfterViewChecked(): void {
    this.cdr.detectChanges(); // Trigger change detection to avoid ExpressionChangedAfterItHasBeenCheckedError
  }

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }
}
